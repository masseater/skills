import { appendFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { gunzipSync } from "node:zlib";
import { afterEach, describe, expect, it } from "vite-plus/test";
import type { Detector } from "../lib/betterleaks.ts";
import { BetterleaksUnavailable } from "../lib/betterleaks.ts";
import { run } from "../lib/cli.ts";
import type { Io } from "../lib/cli.ts";

type Stored = { start: number; end: number; body: string; query: URLSearchParams };

class FakeWatashi {
  readonly chunks = new Map<string, Stored[]>();
  readonly requests: { method: string; path: string; authorization: string | null }[] = [];
  conflictOnce = false;

  committed(key: string): number {
    return this.chunks.get(key)?.at(-1)?.end ?? 0;
  }

  text(key: string): string {
    return (this.chunks.get(key) ?? []).map((chunk) => chunk.body).join("");
  }

  readonly fetch = async (input: string | URL | Request, init?: RequestInit): Promise<Response> => {
    const url = new URL(String(input));
    const method = init?.method ?? "GET";
    const headers = new Headers(init?.headers);
    this.requests.push({ method, path: url.pathname, authorization: headers.get("authorization") });
    const q = url.searchParams;
    const key = `${q.get("kind")}/${q.get("session")}/${q.get("file")}`;
    if (method === "GET" && url.pathname === "/api/conversations") {
      return Response.json({ committed: this.committed(key) });
    }
    if (method === "PUT" && url.pathname === "/api/conversations") {
      const start = Number(q.get("start"));
      const end = Number(q.get("end"));
      if (this.conflictOnce || start !== this.committed(key)) {
        this.conflictOnce = false;
        return Response.json({ expected: this.committed(key) }, { status: 409 });
      }
      const body = gunzipSync(Buffer.from(init?.body as Uint8Array)).toString("utf8");
      const list = this.chunks.get(key) ?? [];
      list.push({ start, end, body, query: q });
      this.chunks.set(key, list);
      return Response.json({ committed: end });
    }
    return new Response("not found", { status: 404 });
  };
}

const SECRET = "SECRET-0123456789";

const fakeDetector: Detector = (text) =>
  text.includes(SECRET)
    ? [{ ruleId: "fake", secret: SECRET, encoded: false, startLine: 1, endLine: 1, startColumn: 1, endColumn: 0 }]
    : [];

const dirs: string[] = [];
afterEach(() => {
  for (const dir of dirs.splice(0)) rmSync(dir, { recursive: true, force: true });
});

const SESSION = "6df4989a-c0a7-5129-89d5-965ab358d4fe";

const ON = { WATASHI_SEND_CONVERSATIONS: "1" };

function setup(env: Record<string, string> = { ...ON, WATASHI_TOKEN: "wat_test" }) {
  const root = mkdtempSync(path.join(tmpdir(), "watashi-"));
  dirs.push(root);
  const transcript = path.join(root, "projects", `${SESSION}.jsonl`);
  mkdirSync(path.dirname(transcript), { recursive: true });
  writeFileSync(transcript, "");
  const server = new FakeWatashi();
  const output: string[] = [];
  let stdin = "";
  const io = (overrides: Partial<Io> = {}): Io => ({
    env: { WATASHI_HOME: path.join(root, "home"), WATASHI_URL: "https://watashi.test", ...env },
    fetch: server.fetch as typeof fetch,
    stdin: () => stdin,
    out: (text) => output.push(text),
    err: (text) => output.push(text),
    detector: () => fakeDetector,
    ...overrides,
  });
  const line = (n: number, extra = ""): string => `${JSON.stringify({ type: "user", uuid: `u${n}`, message: `m${n}${extra}` })}\n`;
  const append = (text: string, file = transcript): void => appendFileSync(file, text);
  const stop = async (overrides: Partial<Io> = {}): Promise<number> => {
    stdin = JSON.stringify({ session_id: SESSION, transcript_path: transcript, cwd: "/home/user" });
    return run(["hook", "stop"], io(overrides));
  };
  const key = (file = SESSION): string => `claude-code/${SESSION}/${file}`;
  return { root, transcript, server, io, line, append, stop, key, output };
}

describe("hook stop の差分送信", () => {
  it("増えた完全な行だけを送り、書きかけの行は次に回す", async () => {
    const t = setup();
    t.append(t.line(1) + t.line(2) + '{"type":"user","uuid":"u3"');
    expect(await t.stop()).toBe(0);
    expect(t.server.text(t.key())).toBe(t.line(1) + t.line(2));
    t.append(',"message":"m3"}\n');
    await t.stop();
    expect(t.server.text(t.key())).toBe(`${t.line(1)}${t.line(2)}{"type":"user","uuid":"u3","message":"m3"}\n`);
    const puts = t.server.requests.filter((request) => request.method === "PUT");
    expect(puts).toHaveLength(2);
    expect(puts.every((request) => request.authorization === "Bearer wat_test")).toBe(true);
  });

  it("送る前に秘密を伏せる", async () => {
    const t = setup();
    t.append(t.line(1, ` ${SECRET}`));
    await t.stop();
    const stored = t.server.chunks.get(t.key())?.[0];
    expect(stored?.body).not.toContain(SECRET);
    expect(stored?.body).toContain("[REDACTED:fake]");
    expect(stored?.query.get("redactions")).toBe("1");
    expect(stored?.query.get("start")).toBe("0");
    expect(Number(stored?.query.get("end"))).toBe(Buffer.byteLength(t.line(1, ` ${SECRET}`)));
  });

  it("手元の記録が無ければサーバーの受け取り済みの位置から続ける", async () => {
    const t = setup();
    t.append(t.line(1) + t.line(2));
    await t.stop();
    rmSync(path.join(t.root, "home", "offsets"), { recursive: true });
    t.append(t.line(3));
    await t.stop();
    expect(t.server.text(t.key())).toBe(t.line(1) + t.line(2) + t.line(3));
    expect(t.server.requests.filter((request) => request.method === "GET")).toHaveLength(2);
  });

  it("位置が食い違えばサーバーの位置に合わせて送り直す", async () => {
    const t = setup();
    t.append(t.line(1));
    t.server.conflictOnce = true;
    await t.stop();
    expect(t.server.text(t.key())).toBe(t.line(1));
  });

  it("subagent の会話も別のファイルとして送る", async () => {
    const t = setup();
    t.append(t.line(1));
    const agent = path.join(path.dirname(t.transcript), SESSION, "subagents", "agent-abc.jsonl");
    mkdirSync(path.dirname(agent), { recursive: true });
    writeFileSync(agent, t.line(9));
    await t.stop();
    expect(t.server.text(t.key("subagents/agent-abc"))).toBe(t.line(9));
  });

  it("source と cwd とクラウドのセッション ID を添える", async () => {
    const t = setup({ ...ON, WATASHI_TOKEN: "wat_test", CLAUDE_CODE_REMOTE: "true", CLAUDE_CODE_REMOTE_SESSION_ID: "cse_1" });
    t.append(t.line(1));
    await t.stop();
    const query = t.server.chunks.get(t.key())?.[0]?.query;
    expect(query?.get("source")).toBe("claude-code-cloud");
    expect(query?.get("cwd")).toBe("/home/user");
    expect(query?.get("remoteSession")).toBe("cse_1");
  });

  it("betterleaks が無ければ何も送らず、記録だけ残す", async () => {
    const t = setup();
    t.append(t.line(1, ` ${SECRET}`));
    const code = await t.stop({
      detector: () => {
        throw new BetterleaksUnavailable("missing");
      },
    });
    expect(code).toBe(0);
    expect(t.server.requests.filter((request) => request.method === "PUT")).toHaveLength(0);
    expect(readFileSync(path.join(t.root, "home", "hook.log"), "utf8")).toContain("missing");
  });

  it("送ってよいと環境変数で許していない環境では何もしない", async () => {
    const t = setup({ WATASHI_TOKEN: "wat_test" });
    t.append(t.line(1));
    expect(await t.stop()).toBe(0);
    expect(t.server.requests).toHaveLength(0);
  });

  it("認証が無ければ何もしない", async () => {
    const t = setup(ON);
    t.append(t.line(1));
    expect(await t.stop()).toBe(0);
    expect(t.server.requests).toHaveLength(0);
  });

  it("大きな履歴は行の境目で分けて送る", async () => {
    const t = setup();
    const lines = Array.from({ length: 50 }, (_, n) => t.line(n, "x".repeat(1000)));
    t.append(lines.join(""));
    const { pushFile } = await import("../lib/push.ts");
    const { OffsetStore } = await import("../lib/state.ts");
    const result = await pushFile(
      { kind: "claude-code", session: SESSION, file: SESSION, path: t.transcript, cwd: "", source: "x", remoteSession: "" },
      {
        api: { url: "https://watashi.test", fetch: t.server.fetch as typeof fetch, authorization: async () => "Bearer x" },
        detect: fakeDetector,
        offsets: new OffsetStore(path.join(t.root, "home")),
        maxChunkBytes: 8 * 1024,
      },
    );
    expect(result.chunks).toBeGreaterThan(5);
    const stored = t.server.chunks.get(t.key()) ?? [];
    expect(stored.every((chunk) => chunk.body.endsWith("\n"))).toBe(true);
    expect(t.server.text(t.key())).toBe(lines.join(""));
  });
});
