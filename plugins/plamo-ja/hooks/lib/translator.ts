import type { Config } from "./config.ts";
import { translate } from "./plamo.ts";
import { looksBroken, type TranslateBatch } from "./render.ts";
import type { TranslationPair } from "./schema.ts";
import type { Store } from "./store.ts";

export const SERVER_SLOTS = 4;

async function attempt(
  en: string,
  history: TranslationPair[],
  config: Config,
): Promise<{ ja: string } | { error: unknown }> {
  try {
    const ja = await translate(en, history, config);
    return looksBroken(en, ja) ? { error: new Error(`broken translation: ${ja}`) } : { ja };
  } catch (error) {
    return { error };
  }
}

async function translateOne(
  en: string,
  history: TranslationPair[],
  config: Config,
  onError: (error: unknown, en: string) => void,
): Promise<string | null> {
  const first = await attempt(en, history, config);
  if ("ja" in first) return first.ja;
  const second = await attempt(en, [], config);
  if ("ja" in second) return second.ja;
  onError(second.error, en);
  return null;
}

async function mapLimited<T, R>(
  items: T[],
  limit: number,
  work: (item: T) => Promise<R>,
): Promise<R[]> {
  const results: R[] = Array.from({ length: items.length });
  let next = 0;
  const lane = async () => {
    while (next < items.length) {
      const index = next++;
      results[index] = await work(items[index] as T);
    }
  };
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, lane));
  return results;
}

export function createBatchTranslator(
  store: Store,
  sessionId: string,
  config: Config,
  onError: (error: unknown, en: string) => void,
): TranslateBatch {
  return async (sources) => {
    const history = store.history(sessionId, config.historyBudget);
    const results = await mapLimited(sources, SERVER_SLOTS, (en) =>
      translateOne(en, history, config, onError),
    );
    const pairs = sources.flatMap((en, i) => {
      const ja = results[i];
      return ja == null ? [] : [{ en, ja }];
    });
    store.appendHistory(sessionId, pairs);
    return sources.map((en, i) => results[i] ?? en);
  };
}
