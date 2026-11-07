import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { DEFAULT_CONTEXT, type PlamoOptions } from "./plamo.ts";
import { type GlossaryEntry, parseGlossary } from "./schema.ts";

export const DEFAULT_URL = "http://127.0.0.1:8000";

const DEFAULT_HISTORY_BUDGET = 8000;

export type Config = PlamoOptions & { historyBudget: number };

export function autoOn(env: NodeJS.ProcessEnv = process.env): boolean {
  return env.PLAMO_JA_AUTO === "on";
}

function readGlossary(dataDir: string): GlossaryEntry[] {
  const p = path.join(dataDir, "glossary.json");
  if (!existsSync(p)) return [];
  return parseGlossary(JSON.parse(readFileSync(p, "utf8")));
}

function readForm(value: string | undefined): PlamoOptions["form"] {
  return value === "plain" || value === "polite" ? value : undefined;
}

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
