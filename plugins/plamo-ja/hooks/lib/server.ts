import { spawn } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";
import { isServerUp } from "./plamo.ts";

export async function ensureServer(
  url: string,
  command: string | undefined,
  waitMs: number,
): Promise<boolean> {
  if (await isServerUp(url)) return true;
  if (!command) return false;
  spawn("sh", ["-c", command], { detached: true, stdio: "ignore" }).unref();
  const deadline = Date.now() + waitMs;
  while (Date.now() < deadline) {
    await sleep(1000);
    if (await isServerUp(url)) return true;
  }
  return false;
}
