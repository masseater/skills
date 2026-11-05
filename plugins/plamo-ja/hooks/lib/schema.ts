/** 訳した英文と日本語の組。PLaMo に履歴として渡す */
export type TranslationPair = { en: string; ja: string };

/** 1 つのメッセージの、バッチをまたいで持ち越す状態 */
export type MessageState = {
  /** 開いているコードフェンスの記号。フェンスの外なら null */
  fence: string | null;
  /** 処理済みのバッチの表示内容。同じバッチが二度届いたときに同じ結果を返すため */
  done: Record<string, string>;
};

export function emptyMessageState(): MessageState {
  return { fence: null, done: {} };
}

/** PLaMo 3 Translate の Chat Completions API に渡す訳語の指定 */
export type GlossaryEntry = { source: string; target: string };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function fail(what: string): never {
  throw new TypeError(`plamo-ja: unexpected ${what}`);
}

export function parseTranslationPair(value: unknown): TranslationPair {
  if (isRecord(value) && typeof value.en === "string" && typeof value.ja === "string") {
    return { en: value.en, ja: value.ja };
  }
  return fail("history entry");
}

export function parseMessageState(value: unknown): MessageState {
  if (!isRecord(value) || !(value.fence === null || typeof value.fence === "string")) {
    return fail("message state");
  }
  const done: Record<string, string> = {};
  if (isRecord(value.done)) {
    for (const [key, shown] of Object.entries(value.done)) {
      if (typeof shown === "string") done[key] = shown;
    }
  }
  return { fence: value.fence, done };
}

export function parseGlossary(value: unknown): GlossaryEntry[] {
  if (!Array.isArray(value)) return fail("glossary");
  return value.map((entry) =>
    isRecord(entry) && typeof entry.source === "string" && typeof entry.target === "string"
      ? { source: entry.source, target: entry.target }
      : fail("glossary entry"),
  );
}

/** Chat Completions API の応答から訳文を取り出す */
export function parseCompletionContent(value: unknown): string {
  const choice = isRecord(value) && Array.isArray(value.choices) ? value.choices[0] : undefined;
  const message = isRecord(choice) ? choice.message : undefined;
  if (isRecord(message) && typeof message.content === "string") return message.content;
  return fail("completion response");
}
