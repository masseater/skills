import { spawnSync } from "node:child_process";

export function runScript(
  script: string,
  args: string[],
  env?: NodeJS.ProcessEnv,
): { status: number | null; stdout: string; stderr: string } {
  const { status, stdout, stderr } = spawnSync(process.execPath, [script, ...args], { encoding: "utf8", env });
  return { status, stdout, stderr };
}
