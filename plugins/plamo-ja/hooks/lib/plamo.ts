import { type GlossaryEntry, parseCompletionContent, type TranslationPair } from "./schema.ts";

export type PlamoOptions = {
  /** llama-server の URL */
  url: string;
  /** Claude Code の応答であることを伝える参考情報 */
  context: string;
  glossary: GlossaryEntry[];
  /** 日本語の文体。指定が無ければモデルに任せる */
  form: "plain" | "polite" | undefined;
  /** 1 回の問い合わせの待ち時間（ミリ秒） */
  timeoutMs: number;
};

/**
 * PLaMo が訳文の後に出す区切りのトークン
 *
 * 公式の README の例と同じく stop に渡す。llama-server はこの手前で出力を止める。
 * @see https://huggingface.co/pfnet/plamo-3-translate-0.8b-GGUF
 */
const STOP_TOKENS = ["<|plamo:tag|>", "<|plamo:bos|>"];

/** llama-server の `--alias` に渡す名前。README の起動例と合わせる */
export const MODEL_ALIAS = "plamo-3-translate";

export const DEFAULT_CONTEXT =
  "Replies from an AI coding assistant (Claude Code) to a Japanese software developer in a terminal. " +
  "Keep technical terms, file paths, commands, identifiers and inline code unchanged.";

/**
 * 英文 1 つを日本語に訳す
 *
 * @param en - 訳す英文
 * @param history - 先に訳した組。用語と文体をそろえるために渡す
 * @param options - 接続先と訳し方
 * @returns 日本語訳。区切りのトークンと前後の空白は取り除く
 */
export async function translate(
  en: string,
  history: TranslationPair[],
  options: PlamoOptions,
): Promise<string> {
  const messages = history.flatMap((pair) => [
    { role: "user", content: pair.en },
    { role: "assistant", content: pair.ja },
  ]);
  messages.push({ role: "user", content: en });

  const kwargs: Record<string, unknown> = {
    source_lang: "en",
    target_lang: "ja",
    context: options.context,
  };
  if (options.glossary.length > 0) kwargs.glossary = options.glossary;
  if (options.form) kwargs.form = options.form;

  const response = await fetch(`${options.url}/v1/chat/completions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: MODEL_ALIAS,
      messages,
      temperature: 0,
      max_tokens: Math.min(8192, en.length * 3 + 256),
      stop: STOP_TOKENS,
      cache_prompt: true,
      chat_template_kwargs: kwargs,
    }),
    signal: AbortSignal.timeout(options.timeoutMs),
  });
  if (!response.ok) {
    throw new Error(`PLaMo server returned ${response.status}: ${await response.text()}`);
  }
  return parseCompletionContent(await response.json()).trim();
}

/**
 * llama-server が応答するかを確かめる
 *
 * @param url - llama-server の URL
 * @returns `/health` が成功を返せば true
 */
export async function isServerUp(url: string): Promise<boolean> {
  try {
    const response = await fetch(`${url}/health`, { signal: AbortSignal.timeout(3000) });
    return response.ok;
  } catch {
    // 接続できないのは「起動していない」という結果そのものなので、例外ではなく false で返す
    return false;
  }
}
