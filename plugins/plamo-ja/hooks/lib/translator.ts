import type { Config } from "./config.ts";
import { translate } from "./plamo.ts";
import { looksBroken, type TranslateBatch } from "./render.ts";
import type { TranslationPair } from "./schema.ts";
import type { Store } from "./store.ts";

async function translateOne(
  en: string,
  history: TranslationPair[],
  config: Config,
  onError: (error: unknown) => void,
): Promise<string | null> {
  try {
    let ja = await translate(en, history, config);
    if (looksBroken(en, ja)) ja = await translate(en, [], config);
    return looksBroken(en, ja) ? null : ja;
  } catch (error) {
    onError(error);
    return null;
  }
}

export function createBatchTranslator(
  store: Store,
  sessionId: string,
  config: Config,
  onError: (error: unknown) => void,
): TranslateBatch {
  return async (sources) => {
    const history = store.history(sessionId, config.historyBudget);
    const results = await Promise.all(
      sources.map((en) => translateOne(en, history, config, onError)),
    );
    const pairs = sources.flatMap((en, i) => {
      const ja = results[i];
      return ja == null ? [] : [{ en, ja }];
    });
    store.appendHistory(sessionId, pairs);
    return sources.map((en, i) => results[i] ?? en);
  };
}
