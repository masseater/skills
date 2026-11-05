import { existsSync, mkdtempSync, rmSync, utimesSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vite-plus/test";
import { Store } from "../hooks/lib/store.ts";

const dirs: string[] = [];
function makeStore(): Store {
  const dir = mkdtempSync(path.join(tmpdir(), "plamo-ja-"));
  dirs.push(dir);
  return new Store(dir);
}
afterEach(() => {
  for (const dir of dirs.splice(0)) rmSync(dir, { recursive: true, force: true });
});

describe("Store", () => {
  it("セッションごとにモードを切り替える", () => {
    const store = makeStore();
    expect(store.isOn("a")).toBe(false);
    store.setOn("a", true);
    expect(store.isOn("a")).toBe(true);
    expect(store.isOn("b")).toBe(false);
    store.setOn("a", false);
    expect(store.isOn("a")).toBe(false);
  });

  it("履歴を足し、reset で消す", () => {
    const store = makeStore();
    store.appendHistory("s", [{ en: "Hi.", ja: "やあ。" }]);
    expect(store.history("s", 100)).toEqual([{ en: "Hi.", ja: "やあ。" }]);
    store.clearHistory("s");
    expect(store.history("s", 100)).toEqual([]);
  });

  it("1 日より古いメッセージの状態だけを消す", () => {
    const store = makeStore();
    store.writeMessage("old", { fence: null, done: {} });
    store.writeMessage("new", { fence: "```", done: {} });
    const oldPath = path.join(store.dataDir, "messages", "old.json");
    const twoDaysAgo = (Date.now() - 2 * 24 * 60 * 60 * 1000) / 1000;
    utimesSync(oldPath, twoDaysAgo, twoDaysAgo);
    store.pruneMessages();
    expect(store.readMessage("old")).toEqual({ fence: null, done: {} });
    expect(store.readMessage("new").fence).toBe("```");
  });

  it("落とした後は、上限を超えるまで先頭を変えない", () => {
    const store = makeStore();
    for (let i = 0; i < 4; i++) store.appendHistory("s", [{ en: "aaaa", ja: "bbbb" }]);
    expect(store.history("s", 20)).toHaveLength(1);
    store.appendHistory("s", [{ en: "cccc", ja: "dddd" }]);
    expect(store.history("s", 20)).toEqual([
      { en: "aaaa", ja: "bbbb" },
      { en: "cccc", ja: "dddd" },
    ]);
  });

  it("読むだけではデータディレクトリを作らない", () => {
    const store = makeStore();
    expect(store.isOn("s")).toBe(false);
    store.pruneMessages();
    expect(store.readMessage("m")).toEqual({ fence: null, done: {} });
    expect(existsSync(path.join(store.dataDir, "sessions"))).toBe(false);
    expect(existsSync(path.join(store.dataDir, "messages"))).toBe(false);
  });
});

describe("履歴の切り出し", () => {
  it("上限に収まれば全部を返し、超えたら上限の半分まで一度に落とす", () => {
    const store = makeStore();
    for (let i = 0; i < 6; i++) store.appendHistory("s", [{ en: "12345", ja: "12345" }]);
    expect(store.history("s", 60)).toHaveLength(6);
    for (let i = 0; i < 4; i++) store.appendHistory("s", [{ en: "12345", ja: "12345" }]);
    expect(store.history("s", 60)).toHaveLength(3);
  });
});
