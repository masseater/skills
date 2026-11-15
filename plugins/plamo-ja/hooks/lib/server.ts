import { spawn } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";
import { isServerUp } from "./plamo.ts";
import { installRuntime, isLocalUrl, startRuntime } from "./runtime.ts";

async function start(url: string, command: string | undefined): Promise<boolean> {
  if (command) {
    spawn("sh", ["-c", command], { detached: true, stdio: "ignore" }).unref();
    return true;
  }
  if (!isLocalUrl(url)) return false;
  const runtime = await installRuntime().catch((error: unknown) => {
    process.stderr.write(`${String(error)}\n`);
    return undefined;
  });
  if (!runtime) return false;
  startRuntime(runtime, new URL(url).port || "80");
  return true;
}

export async function ensureServer(
  url: string,
  command: string | undefined,
  waitMs: number,
): Promise<boolean> {
  if (await isServerUp(url)) return true;
  if (!(await start(url, command))) return false;
  const deadline = Date.now() + waitMs;
  while (Date.now() < deadline) {
    await sleep(1000);
    if (await isServerUp(url)) return true;
  }
  return false;
}
