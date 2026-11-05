import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { DEFAULT_CONTEXT, type PlamoOptions } from "./plamo.ts";
import { type GlossaryEntry, parseGlossary } from "./schema.ts";

/** llama-server の既定の接続先。README の起動例の `--port 8000` と合わせる */
export const DEFAULT_URL = "http://127.0.0.1:8000";

/** PLaMo に渡す履歴の文字数の上限の既定値 */
const DEFAULT_HISTORY_BUDGET = 8000;

export type Config = PlamoOptions & { historyBudget: number };

function readGlossary(dataDir: string): GlossaryEntry[] {
  const p = path.join(dataDir, "glossary.json");
  if (!existsSync(p)) return [];
  return parseGlossary(JSON.parse(readFileSync(p, "utf8")));
}

function readForm(value: string | undefined): PlamoOptions["form"] {
  return value === "plain" || value === "polite" ? value : undefined;
}

/**
 * 環境変数とデータディレクトリの glossary.json から設定を組み立てる
 *
 * - `PLAMO_JA_URL`: llama-server の URL
 * - `PLAMO_JA_FORM`: `plain`（である調）か `polite`（です・ます調）
 * - `PLAMO_JA_HISTORY_BUDGET`: 履歴の文字数の上限
 *
 * @param dataDir - glossary.json を探すディレクトリ
 * @param env - 読む環境変数
 * @returns 訳し方の設定
 */
export function loadConfig(dataDir: string, env: NodeJS.ProcessEnv = process.env): Config {
  const budget = Number(env.PLAMO_JA_HISTORY_BUDGET);
  return {
    url: (env.PLAMO_JA_URL || DEFAULT_URL).replace(/\/+$/, ""),
    context: DEFAULT_CONTEXT,
    glossary: readGlossary(dataDir),
    form: readForm(env.PLAMO_JA_FORM),
    timeoutMs: 25_000,
    historyBudget: Number.isFinite(budget) && budget > 0 ? budget : DEFAULT_HISTORY_BUDGET,
  };
}
