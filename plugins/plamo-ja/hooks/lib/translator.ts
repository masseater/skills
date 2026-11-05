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

/**
 * セッションの履歴を使って訳し、訳した組を履歴に足す訳し方を作る
 *
 * 1 回のバッチの本文は、バッチの前までの履歴を共有して並列に訳す。
 * 履歴つきの訳が壊れていたら履歴なしで 1 回だけ訳し直し、それでも壊れているか、
 * サーバーに届かないときは英文をそのまま返す。表示を止めないため例外は外に出さず、
 * `onError` に渡す。
 *
 * @param store - 履歴の置き場
 * @param sessionId - 対象のセッション
 * @param config - 訳し方の設定
 * @param onError - 訳せなかったときに呼ぶ
 * @returns バッチの訳し方
 */
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
