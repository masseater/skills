import { readFileSync } from "node:fs";

export function readHookInput(): Record<string, unknown> {
  const value: unknown = JSON.parse(readFileSync(0, "utf8"));
  if (typeof value !== "object" || value === null) throw new TypeError("plamo-ja: bad hook input");
  return value as Record<string, unknown>;
}

export function field(input: Record<string, unknown>, key: string): string {
  const value = input[key];
  return typeof value === "string" ? value : "";
}

export function writeHookOutput(output: Record<string, unknown>): void {
  process.stdout.write(JSON.stringify({ hookSpecificOutput: output }));
}
