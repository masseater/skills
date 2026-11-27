import { execFile } from "node:child_process";
import { existsSync, mkdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import path from "node:path";
import { promisify } from "node:util";

const run = promisify(execFile);

export const FALLOW_VERSION = "3.49.0";

const LOCK_STALE_MS = 30 * 60 * 1000;

export function runtimeRoot(env: NodeJS.ProcessEnv = process.env): string {
  const cache = env.XDG_CACHE_HOME || path.join(homedir(), ".cache");
  return path.join(cache, "cross-similar-code");
}

export function fallowDir(root: string): string {
  return path.join(root, `fallow-${FALLOW_VERSION}`);
}

export function fallowBin(root: string): string {
  return path.join(fallowDir(root), "node_modules", ".bin", "fallow");
}

export function isModelReady(status: string): boolean {
  return /^\s*Ready:\s*yes\s*$/m.test(status);
}

async function modelReady(bin: string): Promise<boolean> {
  try {
    const { stdout } = await run(bin, ["similar-code", "status"]);
    return isModelReady(stdout);
  } catch {
    return false;
  }
}

export async function ensureRuntime(root: string = runtimeRoot()): Promise<string> {
  const dir = fallowDir(root);
  const bin = fallowBin(root);
  if (!existsSync(bin)) {
    mkdirSync(dir, { recursive: true });
    writeFileSync(path.join(dir, "package.json"), '{"private":true}\n');
    await run("npm", [
      "install",
      "--prefix",
      dir,
      "--no-audit",
      "--no-fund",
      `fallow@${FALLOW_VERSION}`,
      `fallow-similar-code@${FALLOW_VERSION}`,
    ]);
  }
  if (!(await modelReady(bin))) await run(bin, ["similar-code", "setup", "--local", "--yes"]);
  return bin;
}

export function takeLock(root: string, now: number = Date.now()): (() => void) | undefined {
  mkdirSync(root, { recursive: true });
  const lock = path.join(root, "install.lock");
  if (existsSync(lock) && now - statSync(lock).mtimeMs > LOCK_STALE_MS) {
    rmSync(lock, { recursive: true, force: true });
  }
  try {
    mkdirSync(lock);
  } catch {
    return undefined;
  }
  return () => rmSync(lock, { recursive: true, force: true });
}
