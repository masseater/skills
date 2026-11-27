import { spawnSync } from "node:child_process";
import path from "node:path";

const claudeBin = path.resolve(import.meta.dirname, "../node_modules/.bin/claude");

export function claude(
  args: string[],
  options: { cwd: string; env?: NodeJS.ProcessEnv },
): { status: number | null; output: string } {
  const result = spawnSync(claudeBin, args, { encoding: "utf8", ...options });
  return { status: result.status, output: `${result.stdout}${result.stderr}` };
}
