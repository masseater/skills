import { spawnSync } from "node:child_process";

export const BETTERLEAKS_VERSION = "2.0.0-rc.7";

const MAX_OUTPUT = 512 * 1024 * 1024;

export const BETTERLEAKS_CONFIG = `
[extend]
useDefault = true

[[rules]]
id = 'watashi-token'
description = 'watashi API token'
regex = '''\\b(wat_[A-Za-z0-9_-]{43})'''
keywords = ['wat_']
confidence = 'high'

[[rules]]
id = 'pasted-token'
description = 'High-entropy token pasted into a conversation'
regex = '''(?:^|[^A-Za-z0-9_\\-])([A-Za-z0-9_\\-]{32,256})(?:[^A-Za-z0-9_\\-]|$)'''
confidence = 'medium'
filter = '''
entropy(finding["secret"]) < 4.0 || !(finding["secret"] matches "[A-Z]" && finding["secret"] matches "[a-z]" && finding["secret"] matches "[0-9]") || matchesAny(finding["secret"], [\`^(?:session|cse|cmsg|toolu|srvtoolu|msg|req|chan|env|trig|user|file|call|agent)_\`])
'''
`;

export type Finding = {
  ruleId: string;
  secret: string;
  encoded: boolean;
  startLine: number;
  endLine: number;
  startColumn: number;
  endColumn: number;
};

export type Detector = (text: string) => Finding[];

type RawFinding = {
  rule_id?: unknown;
  encodings?: unknown;
  decode_depth?: unknown;
  match?: { value?: unknown; full?: unknown };
  location?: { start_line?: unknown; end_line?: unknown; start_column?: unknown; end_column?: unknown };
};

export class BetterleaksUnavailable extends Error {}

const numberOr = (value: unknown, fallback: number): number =>
  typeof value === "number" ? value : fallback;

function toFinding(raw: RawFinding): Finding {
  const value = raw.match?.value;
  const full = raw.match?.full;
  const secret = typeof value === "string" && value !== "" ? value : typeof full === "string" ? full : "";
  const encoded =
    (Array.isArray(raw.encodings) && raw.encodings.length > 0) || numberOr(raw.decode_depth, 0) > 0;
  const startLine = numberOr(raw.location?.start_line, 1);
  return {
    ruleId: typeof raw.rule_id === "string" ? raw.rule_id : "secret",
    secret,
    encoded,
    startLine,
    endLine: numberOr(raw.location?.end_line, startLine),
    startColumn: numberOr(raw.location?.start_column, 1),
    endColumn: numberOr(raw.location?.end_column, 0),
  };
}

export function parseReport(stdout: string): Finding[] {
  const report: unknown = JSON.parse(stdout);
  if (typeof report !== "object" || report === null) throw new Error("betterleaks: bad report");
  const findings = (report as { findings?: unknown }).findings;
  if (findings === undefined || findings === null) return [];
  if (!Array.isArray(findings)) throw new Error("betterleaks: findings is not an array");
  return findings.map((raw: RawFinding) => toFinding(raw));
}

function works(command: readonly string[]): boolean {
  const [file, ...args] = command;
  if (file === undefined) return false;
  const result = spawnSync(file, [...args, "version"], { encoding: "utf8" });
  return result.status === 0 && result.stdout.includes(BETTERLEAKS_VERSION.split(".")[0] ?? "2");
}

export function resolveBetterleaks(env: NodeJS.ProcessEnv = process.env): string[] {
  const candidates: string[][] = [];
  const explicit = env["WATASHI_BETTERLEAKS"];
  if (explicit) candidates.push([explicit]);
  candidates.push(["mise", "exec", `betterleaks@${BETTERLEAKS_VERSION}`, "--", "betterleaks"]);
  candidates.push(["betterleaks"]);
  for (const command of candidates) {
    if (works(command)) return command;
  }
  throw new BetterleaksUnavailable(
    `betterleaks ${BETTERLEAKS_VERSION} was not found. Install it with mise or set WATASHI_BETTERLEAKS.`,
  );
}

export function betterleaksDetector(command: readonly string[]): Detector {
  const [file, ...prefix] = command;
  if (file === undefined) throw new BetterleaksUnavailable("empty betterleaks command");
  const { BETTERLEAKS_CONFIG: _ignored, ...inherited } = process.env;
  const env = { ...inherited, BETTERLEAKS_CONFIG_TOML: BETTERLEAKS_CONFIG };
  return (text) => {
    const result = spawnSync(
      file,
      [...prefix, "stdin", "--no-banner", "--log-level", "error", "--output", "-", "--exit-code", "0"],
      {
        input: text,
        encoding: "utf8",
        maxBuffer: MAX_OUTPUT,
        env,
      },
    );
    if (result.error) throw result.error;
    if (result.status !== 0) {
      throw new Error(`betterleaks exited with ${result.status}: ${result.stderr.slice(0, 2000)}`);
    }
    return parseReport(result.stdout);
  };
}
