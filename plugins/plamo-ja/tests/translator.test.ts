import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it, vi } from "vite-plus/test";
import { loadConfig } from "../hooks/lib/config.ts";
import { Store } from "../hooks/lib/store.ts";
import { createBatchTranslator } from "../hooks/lib/translator.ts";

const dirs: string[] = [];
function setup() {
  const dir = mkdtempSync(path.join(tmpdir(), "plamo-ja-"));
  dirs.push(dir);
  const store = new Store(dir);
  return { store, config: loadConfig(dir, {}) };
}

type RequestBody = {
  messages: { role: string; content: string }[];
  chat_template_kwargs: Record<string, unknown>;
};

function requestBody(fetchMock: { mock: { calls: unknown[][] } }, call: number): RequestBody {
  const init = fetchMock.mock.calls[call]?.[1] as { body: string };
  return JSON.parse(init.body) as RequestBody;
}

function reply(content: string): Response {
  return new Response(JSON.stringify({ choices: [{ message: { content } }] }));
}

afterEach(() => {
  vi.unstubAllGlobals();
  for (const dir of dirs.splice(0)) rmSync(dir, { recursive: true, force: true });
});

describe("createBatchTranslator", () => {
  it("訳を返し、履歴に足す", async () => {
    const fetchMock = vi.fn(async () => reply("テストは通った。"));
    vi.stubGlobal("fetch", fetchMock);
    const { store, config } = setup();
    const batch = createBatchTranslator(store, "s", config, vi.fn());

    expect(await batch(["The test passed."])).toEqual(["テストは通った。"]);
    expect(store.history("s", 1000)).toEqual([{ en: "The test passed.", ja: "テストは通った。" }]);

    await batch(["Next."]);
    const body = requestBody(fetchMock, 1);
    expect(body.messages.map((m) => m.role)).toEqual(["user", "assistant", "user"]);
    expect(body.chat_template_kwargs).toMatchObject({ source_lang: "en", target_lang: "ja" });
  });

  it("壊れた訳は履歴なしで訳し直す", async () => {
    const en = "This sentence is long enough to need a Japanese translation here.";
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(reply(en))
      .mockResolvedValueOnce(reply("この文は日本語に訳す必要がある。"));
    vi.stubGlobal("fetch", fetchMock);
    const { store, config } = setup();
    store.appendHistory("s", [{ en: "Old.", ja: "古い。" }]);

    expect(await createBatchTranslator(store, "s", config, vi.fn())([en])).toEqual([
      "この文は日本語に訳す必要がある。",
    ]);
    expect(requestBody(fetchMock, 1).messages).toHaveLength(1);
  });

  it("同じバッチの本文は同じ履歴で並列に訳し、順に履歴へ足す", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(reply("一つ目。"))
      .mockResolvedValueOnce(reply("二つ目。"));
    vi.stubGlobal("fetch", fetchMock);
    const { store, config } = setup();

    expect(await createBatchTranslator(store, "s", config, vi.fn())(["One.", "Two."])).toEqual([
      "一つ目。",
      "二つ目。",
    ]);
    expect(requestBody(fetchMock, 1).messages).toHaveLength(1);
    expect(store.history("s", 1000).map((pair) => pair.en)).toEqual(["One.", "Two."]);
  });

  it("サーバーに届かなければ英文を返し、エラーを渡す", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("ECONNREFUSED")));
    const { store, config } = setup();
    const onError = vi.fn();

    expect(await createBatchTranslator(store, "s", config, onError)(["Hello."])).toEqual([
      "Hello.",
    ]);
    expect(onError).toHaveBeenCalledOnce();
    expect(store.history("s", 1000)).toEqual([]);
  });
});
