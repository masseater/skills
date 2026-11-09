import { homedir } from "node:os";
import path from "node:path";

export const DEFAULT_URL = "https://watashi.masseater.dev";
export const RESOURCE_PATH = "/mcp";
export const KINDS = ["claude-code"] as const;
export type Kind = (typeof KINDS)[number];

export type Env = Readonly<Record<string, string | undefined>>;

export const serverUrl = (env: Env): string => (env["WATASHI_URL"] ?? DEFAULT_URL).replace(/\/+$/u, "");

export function homeDir(env: Env): string {
  const explicit = env["WATASHI_HOME"];
  if (explicit) return explicit;
  const config = env["XDG_CONFIG_HOME"] ?? path.join(homedir(), ".config");
  return path.join(config, "watashi");
}

export function sourceOf(env: Env): string {
  return env["CLAUDE_CODE_REMOTE"] === "true" ? "claude-code-cloud" : "claude-code-local";
}

export const isKind = (value: string): value is Kind => (KINDS as readonly string[]).includes(value);

export const SEND_SWITCH = "WATASHI_SEND_CONVERSATIONS";

export const sendAllowed = (env: Env): boolean => ["1", "true", "on"].includes(env[SEND_SWITCH]?.toLowerCase() ?? "");
