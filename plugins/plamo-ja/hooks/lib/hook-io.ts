import { readFileSync } from "node:fs";

/** hook の標準入力の JSON を読む */
export function readHookInput(): Record<string, unknown> {
  const value: unknown = JSON.parse(readFileSync(0, "utf8"));
  if (typeof value !== "object" || value === null) throw new TypeError("plamo-ja: bad hook input");
  return value as Record<string, unknown>;
}

/** 入力の文字列のフィールドを取り出す。無ければ空文字にする */
export function field(input: Record<string, unknown>, key: string): string {
  const value = input[key];
  return typeof value === "string" ? value : "";
}

/** hookSpecificOutput を標準出力に書く */
export function writeHookOutput(output: Record<string, unknown>): void {
  process.stdout.write(JSON.stringify({ hookSpecificOutput: output }));
}
