import { appendFileSync, mkdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { parseArgs } from "node:util";
import { issueToken, listTokens, revokeToken } from "./api.ts";
import type { Api, Fetch } from "./api.ts";
import { betterleaksDetector, resolveBetterleaks } from "./betterleaks.ts";
import type { Detector } from "./betterleaks.ts";
import { homeDir, isKind, sendAllowed, serverUrl, sourceOf } from "./config.ts";
import type { Env } from "./config.ts";
import { maskText } from "./mask.ts";
import { forgetCredentials, freshAccessToken, login } from "./oauth.ts";
import { pushFile } from "./push.ts";
import type { PushResult } from "./push.ts";
import { OffsetStore, tryLock } from "./state.ts";
import { transcriptFiles } from "./transcript.ts";

export type Io = {
  env: Env;
  fetch: Fetch;
  stdin: () => string;
  out: (text: string) => void;
  err: (text: string) => void;
  detector?: () => Detector;
};

const USAGE = `watashi <command>

  login                         ブラウザで watashi にログインする
  logout                        保存したログインを消す
  token issue --scope conversation:write [--label <名前>]
                                長期のトークンを発行して表示する（WATASHI_TOKEN に入れて使う）
  token list                    発行したトークンを一覧する
  token revoke <id>             トークンを失効させる
  conversation push --kind claude-code --session <id> [--cwd <dir>] <transcript.jsonl>
                                会話履歴の増えた行を、秘密を伏せてから送る
  mask                          標準入力の JSONL の秘密を伏せて標準出力に書く
  hook stop                     Claude Code の Stop フックとして動く（WATASHI_SEND_CONVERSATIONS=1 の環境だけ送る）

環境変数: WATASHI_SEND_CONVERSATIONS・WATASHI_TOKEN・WATASHI_URL・WATASHI_HOME・WATASHI_BETTERLEAKS
`;

export class UsageError extends Error {}

async function authorization(io: Io, home: string): Promise<string | undefined> {
  const token = io.env["WATASHI_TOKEN"];
  if (token) return `Bearer ${token}`;
  const access = await freshAccessToken(home, io.fetch);
  return access === undefined ? undefined : `Bearer ${access}`;
}

function apiOf(io: Io, header: string): Api {
  return { url: serverUrl(io.env), fetch: io.fetch, authorization: async () => header };
}

async function requireApi(io: Io, home: string): Promise<Api> {
  const header = await authorization(io, home);
  if (header === undefined) throw new UsageError("ログインしていない。watashi login を実行するか WATASHI_TOKEN を設定する。");
  return apiOf(io, header);
}

const detectorOf = (io: Io): Detector => (io.detector ?? (() => betterleaksDetector(resolveBetterleaks(io.env))))();

type PushRequest = { kind: string; session: string; transcript: string; cwd: string };

async function pushSession(io: Io, api: Api, home: string, request: PushRequest): Promise<PushResult[]> {
  const detect = detectorOf(io);
  const offsets = new OffsetStore(home);
  const results: PushResult[] = [];
  for (const file of transcriptFiles(request.transcript, request.session)) {
    results.push(
      await pushFile(
        {
          kind: request.kind,
          session: request.session,
          file: file.file,
          path: file.path,
          cwd: request.cwd,
          source: sourceOf(io.env),
          remoteSession: io.env["CLAUDE_CODE_REMOTE_SESSION_ID"] ?? "",
        },
        { api, detect, offsets },
      ),
    );
  }
  return results;
}

const summary = (results: readonly PushResult[]): string => {
  const total = results.reduce(
    (sum, result) => ({
      chunks: sum.chunks + result.chunks,
      bytes: sum.bytes + result.bytes,
      redactions: sum.redactions + result.redactions,
    }),
    { chunks: 0, bytes: 0, redactions: 0 },
  );
  return `${results.length} files, ${total.chunks} chunks, ${total.bytes} bytes, ${total.redactions} redactions`;
};

async function conversationPush(io: Io, home: string, args: string[]): Promise<void> {
  const { values, positionals } = parseArgs({
    args,
    allowPositionals: true,
    options: { kind: { type: "string" }, session: { type: "string" }, cwd: { type: "string" } },
  });
  const kind = values.kind ?? "";
  const transcript = positionals[0];
  if (!isKind(kind) || values.session === undefined || transcript === undefined) {
    throw new UsageError("conversation push --kind claude-code --session <id> <transcript.jsonl>");
  }
  const api = await requireApi(io, home);
  const results = await pushSession(io, api, home, {
    kind,
    session: values.session,
    transcript: path.resolve(transcript),
    cwd: values.cwd ?? process.cwd(),
  });
  io.out(`${summary(results)}\n`);
}

type StopInput = { session_id?: unknown; transcript_path?: unknown; cwd?: unknown };

function logHookError(home: string, error: unknown): void {
  try {
    mkdirSync(home, { recursive: true });
    const message = error instanceof Error ? (error.stack ?? error.message) : String(error);
    appendFileSync(path.join(home, "hook.log"), `${new Date().toISOString()} ${message}\n`);
  } catch {
    return;
  }
}

async function hookStop(io: Io, home: string): Promise<void> {
  const input = JSON.parse(io.stdin()) as StopInput;
  if (typeof input.session_id !== "string" || typeof input.transcript_path !== "string") return;
  if (!sendAllowed(io.env)) return;
  const header = await authorization(io, home);
  if (header === undefined) return;
  const release = tryLock(home, `claude-code-${input.session_id}`);
  if (release === undefined) return;
  try {
    await pushSession(io, apiOf(io, header), home, {
      kind: "claude-code",
      session: input.session_id,
      transcript: input.transcript_path,
      cwd: typeof input.cwd === "string" ? input.cwd : "",
    });
  } finally {
    release();
  }
}

async function token(io: Io, home: string, args: string[]): Promise<void> {
  const [action, ...rest] = args;
  const api = await requireApi(io, home);
  if (action === "issue") {
    const { values } = parseArgs({ args: rest, options: { scope: { type: "string" }, label: { type: "string" } } });
    if (values.scope !== "conversation:write") throw new UsageError("token issue --scope conversation:write");
    const issued = await issueToken(api, values.scope, values.label ?? "");
    io.out(`${issued.token}\n`);
    io.err(`id: ${issued.id}  scope: ${issued.scope}  label: ${issued.label}\nこの値は二度と表示しない。WATASHI_TOKEN に設定する。\n`);
    return;
  }
  if (action === "list") {
    for (const item of await listTokens(api)) {
      io.out(`${item.id}\t${item.scope}\t${item.label}\t${item.createdAt}\t${item.revokedAt ?? "active"}\n`);
    }
    return;
  }
  if (action === "revoke" && rest[0] !== undefined) {
    await revokeToken(api, rest[0]);
    io.out(`revoked ${rest[0]}\n`);
    return;
  }
  throw new UsageError("token issue|list|revoke");
}

export async function run(args: string[], io: Io): Promise<number> {
  const home = homeDir(io.env);
  const [command, ...rest] = args;
  try {
    switch (command) {
      case "login": {
        await login(home, serverUrl(io.env), io.fetch, (url) => io.err(`ブラウザで開いてログインする:\n${url}\n`));
        io.out("ログインした。\n");
        return 0;
      }
      case "logout":
        forgetCredentials(home);
        io.out("ログインを消した。\n");
        return 0;
      case "token":
        await token(io, home, rest);
        return 0;
      case "conversation":
        if (rest[0] !== "push") throw new UsageError("conversation push");
        await conversationPush(io, home, rest.slice(1));
        return 0;
      case "mask":
        io.out(maskText(io.stdin(), detectorOf(io)).text);
        return 0;
      case "hook":
        if (rest[0] !== "stop") throw new UsageError("hook stop");
        try {
          await hookStop(io, home);
        } catch (error) {
          logHookError(home, error);
        }
        return 0;
      default:
        io.out(USAGE);
        return command === undefined || command === "help" || command === "--help" ? 0 : 2;
    }
  } catch (error) {
    if (error instanceof UsageError) {
      io.err(`${error.message}\n\n${USAGE}`);
      return 2;
    }
    io.err(`${error instanceof Error ? error.message : String(error)}\n`);
    return 1;
  }
}

export const processIo = (): Io => ({
  env: process.env,
  fetch: globalThis.fetch,
  stdin: () => readFileSync(0, "utf8"),
  out: (text) => process.stdout.write(text),
  err: (text) => process.stderr.write(text),
});
