import { readFileSync } from "node:fs";

export type HookInput = Record<string, unknown>;

export function readHookInput(): HookInput {
  const value: unknown = JSON.parse(readFileSync(0, "utf8"));
  if (typeof value !== "object" || value === null) {
    throw new TypeError("existing-libraries: bad hook input");
  }
  return value as HookInput;
}

export function record(input: HookInput, key: string): HookInput {
  const value = input[key];
  return typeof value === "object" && value !== null ? (value as HookInput) : {};
}

export function field(input: HookInput, key: string): string {
  const value = input[key];
  return typeof value === "string" ? value : "";
}

export function writeHookOutput(output: Record<string, unknown>): void {
  process.stdout.write(JSON.stringify({ hookSpecificOutput: output }));
}
