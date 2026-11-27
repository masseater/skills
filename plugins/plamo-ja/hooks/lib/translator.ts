import { firstOk } from "./first-ok.ts";
import type { Config } from "./config.ts";
import { translate } from "./plamo.ts";
import { looksBroken, type TranslateBatch } from "./render.ts";
import type { TranslationPair } from "./schema.ts";
import type { Store } from "./store.ts";

export const SERVER_SLOTS = 4;

async function translateChecked(
  en: string,
  history: TranslationPair[],
  config: Config,
): Promise<string> {
  const ja = await translate(en, history, config);
  if (looksBroken(en, ja)) throw new Error(`broken translation: ${ja}`);
  return ja;
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

export async function translateSources(
  sources: string[],
  history: TranslationPair[],
  config: Config,
  onError: (error: unknown, en: string) => void,
): Promise<(string | null)[]> {
  return mapLimited(sources, SERVER_SLOTS, async (en) => {
    const outcome = await firstOk(
      [history, []].map((given) => () => translateChecked(en, given, config)),
    );
    if (outcome.ok) return outcome.value;
    onError(outcome.error, en);
    return null;
  });
}

export function createBatchTranslator(
  store: Store,
  sessionId: string,
  config: Config,
  onError: (error: unknown, en: string) => void,
): TranslateBatch {
  return async (sources) => {
    const history = store.history(sessionId, config.historyBudget);
    const results = await translateSources(sources, history, config, onError);
    const pairs = sources.flatMap((en, i) => {
      const ja = results[i];
      return ja == null ? [] : [{ en, ja }];
    });
    store.appendHistory(sessionId, pairs);
    return sources.map((en, i) => results[i] ?? en);
  };
}
