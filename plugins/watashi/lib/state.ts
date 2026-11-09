import { mkdirSync, readFileSync, renameSync, rmSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";

const STALE_LOCK_MS = 10 * 60 * 1000;

export type OffsetKey = { kind: string; session: string; file: string };

const safe = (value: string): string => value.replace(/[^A-Za-z0-9_.-]/gu, "_");

export class OffsetStore {
  readonly dir: string;

  constructor(home: string) {
    this.dir = path.join(home, "offsets");
  }

  private fileOf(key: OffsetKey): string {
    return path.join(this.dir, safe(key.kind), `${safe(key.session)}.json`);
  }

  private read(key: OffsetKey): Record<string, number> {
    try {
      const parsed: unknown = JSON.parse(readFileSync(this.fileOf(key), "utf8"));
      return typeof parsed === "object" && parsed !== null ? (parsed as Record<string, number>) : {};
    } catch {
      return {};
    }
  }

  get(key: OffsetKey): number | undefined {
    const value = this.read(key)[key.file];
    return typeof value === "number" ? value : undefined;
  }

  set(key: OffsetKey, offset: number): void {
    const target = this.fileOf(key);
    mkdirSync(path.dirname(target), { recursive: true });
    const next = { ...this.read(key), [key.file]: offset };
    const temp = `${target}.${process.pid}.tmp`;
    writeFileSync(temp, JSON.stringify(next));
    renameSync(temp, target);
  }
}

export function tryLock(home: string, name: string, now = Date.now()): (() => void) | undefined {
  const dir = path.join(home, "locks", safe(name));
  mkdirSync(path.dirname(dir), { recursive: true });
  try {
    mkdirSync(dir);
  } catch {
    try {
      if (now - statSync(dir).mtimeMs < STALE_LOCK_MS) return undefined;
      rmSync(dir, { recursive: true, force: true });
      mkdirSync(dir);
    } catch {
      return undefined;
    }
  }
  return () => rmSync(dir, { recursive: true, force: true });
}
