import { readFileSync } from "node:fs";
import { isRecord } from "../../dist/kit/record.ts";

export function readHookInput(): Record<string, unknown> {
  const value: unknown = JSON.parse(readFileSync(0, "utf8"));
  if (!isRecord(value)) throw new TypeError("plamo-ja: bad hook input");
  return value;
}

export function field(input: Record<string, unknown>, key: string): string {
  const value = input[key];
  return typeof value === "string" ? value : "";
}

export function writeHookOutput(output: Record<string, unknown>): void {
  process.stdout.write(JSON.stringify({ hookSpecificOutput: output }));
}
