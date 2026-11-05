import {
  appendFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { homedir } from "node:os";
import path from "node:path";
import {
  type MessageState,
  parseMessageState,
  parseTranslationPair,
  type TranslationPair,
} from "./schema.ts";

export type { MessageState, TranslationPair };

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

/**
 * plugin の永続データの置き場を決める
 *
 * hook には Claude Code が `CLAUDE_PLUGIN_DATA` を渡す。skill のスクリプトには SKILL.md が
 * 同じパスを `--data` で渡す。どちらも無い（手で動かした）ときは `~/.cache/plamo-ja` を使う。
 *
 * @param explicit - `--data` で渡されたパス
 * @returns データディレクトリのパス
 */
export function resolveDataDir(explicit?: string): string {
  if (explicit) return explicit;
  if (process.env.CLAUDE_PLUGIN_DATA) return process.env.CLAUDE_PLUGIN_DATA;
  return path.join(homedir(), ".cache", "plamo-ja");
}

function safeName(id: string): string {
  return id.replace(/[^A-Za-z0-9_-]/g, "_") || "default";
}

type Area = "sessions" | "messages";

/** セッションごとのモードと訳の履歴、メッセージごとの状態を読み書きする */
export class Store {
  readonly dataDir: string;

  constructor(dataDir: string) {
    this.dataDir = dataDir;
  }

  private dir(area: Area): string {
    const dir = path.join(this.dataDir, area);
    mkdirSync(dir, { recursive: true });
    return dir;
  }

  private file(area: Area, id: string, ext: string): string {
    return path.join(this.dir(area), `${safeName(id)}${ext}`);
  }

  private onPath(sessionId: string): string {
    return this.file("sessions", sessionId, ".on");
  }

  private historyPath(sessionId: string): string {
    return this.file("sessions", sessionId, ".jsonl");
  }

  private windowPath(sessionId: string): string {
    return this.file("sessions", sessionId, ".window");
  }

  private messagePath(messageId: string): string {
    return this.file("messages", messageId, ".json");
  }

  isOn(sessionId: string): boolean {
    return existsSync(this.onPath(sessionId));
  }

  setOn(sessionId: string, on: boolean): void {
    const p = this.onPath(sessionId);
    if (on) writeFileSync(p, "");
    else rmSync(p, { force: true });
  }

  clearHistory(sessionId: string): void {
    rmSync(this.historyPath(sessionId), { force: true });
    rmSync(this.windowPath(sessionId), { force: true });
  }

  appendHistory(sessionId: string, pair: TranslationPair): void {
    appendFileSync(this.historyPath(sessionId), `${JSON.stringify(pair)}\n`);
  }

  /**
   * PLaMo に渡す履歴を、合計 `budget` 文字に収まるよう新しい側から選ぶ
   *
   * 古い組を 1 つずつ落とすと毎回プロンプトの先頭が変わり、llama-server の
   * プロンプトキャッシュが効かない。上限を超えたときだけ、上限の半分まで一度に落とす。
   * 切り出し位置はファイルに残し、次の呼び出しでも同じ先頭から始める。
   *
   * @param sessionId - 対象のセッション
   * @param budget - 履歴の文字数の上限
   * @returns 古い順の履歴
   */
  history(sessionId: string, budget: number): TranslationPair[] {
    const all = readJsonLines(this.historyPath(sessionId));
    const windowFile = this.windowPath(sessionId);
    const saved = existsSync(windowFile) ? Number(readFileSync(windowFile, "utf8")) : 0;
    const start = selectWindowStart(all, Number.isFinite(saved) ? saved : 0, budget);
    if (start !== saved) writeFileSync(windowFile, String(start));
    return all.slice(start);
  }

  readMessage(messageId: string): MessageState {
    const p = this.messagePath(messageId);
    if (!existsSync(p)) return { fence: null, done: {} };
    return parseMessageState(JSON.parse(readFileSync(p, "utf8")));
  }

  writeMessage(messageId: string, state: MessageState): void {
    writeFileSync(this.messagePath(messageId), JSON.stringify(state));
  }

  /**
   * 1 日より古いメッセージの状態を消す。メッセージはその間に表示し終わっている
   *
   * @param now - 現在時刻（ミリ秒）
   */
  pruneMessages(now: number = Date.now()): void {
    const dir = this.dir("messages");
    for (const name of readdirSync(dir)) {
      const p = path.join(dir, name);
      if (now - statSync(p).mtimeMs > ONE_DAY_MS) rmSync(p, { force: true });
    }
  }
}

function readJsonLines(p: string): TranslationPair[] {
  if (!existsSync(p)) return [];
  return readFileSync(p, "utf8")
    .split("\n")
    .filter((line) => line.trim() !== "")
    .map((line) => parseTranslationPair(JSON.parse(line)));
}

function sizeFrom(pairs: TranslationPair[], start: number): number {
  let total = 0;
  for (let i = start; i < pairs.length; i++) {
    const pair = pairs[i];
    if (pair) total += pair.en.length + pair.ja.length;
  }
  return total;
}

/**
 * 履歴の切り出し位置を決める
 *
 * @param pairs - 古い順の全履歴
 * @param current - 前回の切り出し位置
 * @param budget - 履歴の文字数の上限
 * @returns 新しい切り出し位置
 */
function selectWindowStart(pairs: TranslationPair[], current: number, budget: number): number {
  let start = Math.min(Math.max(0, current), pairs.length);
  if (sizeFrom(pairs, start) <= budget) return start;
  while (start < pairs.length && sizeFrom(pairs, start) > budget / 2) start++;
  return start;
}
