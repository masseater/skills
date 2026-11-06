import { spawn } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";
import { isServerUp } from "./plamo.ts";

/**
 * llama-server が応答しなければ起動コマンドを動かし、応答するまで待つ
 *
 * コマンドは hook の後も動き続けるよう、別のプロセスグループで切り離して起動する。
 *
 * @param url - llama-server の URL
 * @param command - `sh -c` で動かす起動コマンド。無ければ起動しない
 * @param waitMs - 応答を待つ上限（ミリ秒）
 * @returns 応答すれば true
 */
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
