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
  emptyMessageState,
  type MessageState,
  parseMessageState,
  parseTranslationPair,
  type TranslationPair,
} from "./schema.ts";

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

  private file(area: Area, id: string, ext: string): string {
    return path.join(this.dataDir, area, `${safeName(id)}${ext}`);
  }

  /** 書き込む前に置き場を作る。読むだけの呼び出しではディレクトリを作らない */
  private writable(area: Area, id: string, ext: string): string {
    mkdirSync(path.join(this.dataDir, area), { recursive: true });
    return this.file(area, id, ext);
  }

  isOn(sessionId: string): boolean {
    return existsSync(this.file("sessions", sessionId, ".on"));
  }

  setOn(sessionId: string, on: boolean): void {
    if (on) writeFileSync(this.writable("sessions", sessionId, ".on"), "");
    else rmSync(this.file("sessions", sessionId, ".on"), { force: true });
  }

  clearHistory(sessionId: string): void {
    rmSync(this.file("sessions", sessionId, ".jsonl"), { force: true });
  }

  appendHistory(sessionId: string, pairs: TranslationPair[]): void {
    if (pairs.length === 0) return;
    const lines = pairs.map((pair) => `${JSON.stringify(pair)}\n`).join("");
    appendFileSync(this.writable("sessions", sessionId, ".jsonl"), lines);
  }

  /**
   * PLaMo に渡す履歴を、合計 `budget` 文字に収まるよう新しい側から選ぶ
   *
   * 古い組を 1 つずつ落とすと毎回プロンプトの先頭が変わり、llama-server の
   * プロンプトキャッシュが効かない。上限を超えたときだけ、上限の半分に収まる新しい側だけを
   * 残してファイルを書き直す。ファイルの中身がそのまま次に渡す履歴になる。
   *
   * @param sessionId - 対象のセッション
   * @param budget - 履歴の文字数の上限
   * @returns 古い順の履歴
   */
  history(sessionId: string, budget: number): TranslationPair[] {
    const p = this.file("sessions", sessionId, ".jsonl");
    const all = readJsonLines(p);
    let total = all.reduce((sum, pair) => sum + size(pair), 0);
    if (total <= budget) return all;
    let start = 0;
    for (const pair of all) {
      if (total <= budget / 2) break;
      total -= size(pair);
      start++;
    }
    const kept = all.slice(start);
    writeFileSync(p, kept.map((pair) => `${JSON.stringify(pair)}\n`).join(""));
    return kept;
  }

  readMessage(messageId: string): MessageState {
    const p = this.file("messages", messageId, ".json");
    if (!existsSync(p)) return emptyMessageState();
    return parseMessageState(JSON.parse(readFileSync(p, "utf8")));
  }

  writeMessage(messageId: string, state: MessageState): void {
    writeFileSync(this.writable("messages", messageId, ".json"), JSON.stringify(state));
  }

  /**
   * 1 日より古いメッセージの状態を消す。メッセージはその間に表示し終わっている
   *
   * @param now - 現在時刻（ミリ秒）
   */
  pruneMessages(now: number = Date.now()): void {
    const dir = path.join(this.dataDir, "messages");
    if (!existsSync(dir)) return;
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

function size(pair: TranslationPair): number {
  return pair.en.length + pair.ja.length;
}
