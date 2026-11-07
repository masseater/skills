import { type GlossaryEntry, parseCompletionContent, type TranslationPair } from "./schema.ts";

export type PlamoOptions = {
  url: string;
  context: string;
  glossary: GlossaryEntry[];
  form: "plain" | "polite" | undefined;
  timeoutMs: number;
};

const STOP_TOKENS = ["<|plamo:tag|>", "<|plamo:bos|>"];

export const MODEL_ALIAS = "plamo-3-translate";

export const DEFAULT_CONTEXT =
  "Replies from an AI coding assistant (Claude Code) to a Japanese software developer in a terminal. " +
  "Keep technical terms, file paths, commands, identifiers and inline code unchanged.";

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

export async function isServerUp(url: string): Promise<boolean> {
  try {
    const response = await fetch(`${url}/health`, { signal: AbortSignal.timeout(3000) });
    return response.ok;
  } catch {
    return false;
  }
}
