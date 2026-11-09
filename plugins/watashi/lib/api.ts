import { setTimeout as sleep } from "node:timers/promises";

export type Fetch = typeof fetch;

export type Api = {
  url: string;
  authorization: () => Promise<string>;
  fetch: Fetch;
  retryDelayMs?: number;
};

export type ConversationKey = { kind: string; session: string; file: string };

export type UploadMeta = ConversationKey & {
  start: number;
  end: number;
  redactions: number;
  cwd: string;
  source: string;
  remoteSession: string;
};

export type UploadResult = { status: "ok"; committed: number } | { status: "conflict"; expected: number };

export type TokenScope = "conversation:write";

export type IssuedToken = { id: string; token: string; scope: TokenScope; label: string };

export type TokenSummary = {
  id: string;
  scope: TokenScope;
  label: string;
  createdAt: string;
  revokedAt: string | null;
};

export class ApiError extends Error {
  readonly status: number;

  constructor(status: number, body: string) {
    super(`watashi responded ${status}: ${body.slice(0, 500)}`);
    this.status = status;
  }
}

const ATTEMPTS = 4;
const CONFLICT = 409;

const retryable = (status: number): boolean => status === 429 || status >= 500;

async function send(api: Api, pathAndQuery: string, init: RequestInit): Promise<Response> {
  const delay = api.retryDelayMs ?? 1000;
  let lastError: unknown;
  for (let attempt = 0; attempt < ATTEMPTS; attempt += 1) {
    if (attempt > 0) await sleep(delay * 2 ** (attempt - 1));
    try {
      const headers = new Headers(init.headers);
      headers.set("authorization", await api.authorization());
      const response = await api.fetch(`${api.url}${pathAndQuery}`, { ...init, headers });
      if (!retryable(response.status)) return response;
      lastError = new ApiError(response.status, await response.text());
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError;
}

async function json<Value>(response: Response): Promise<Value> {
  const body = await response.text();
  if (!response.ok) throw new ApiError(response.status, body);
  return JSON.parse(body) as Value;
}

const query = (values: Record<string, string | number>): string =>
  new URLSearchParams(Object.entries(values).map(([key, value]) => [key, String(value)])).toString();

export async function committedOffset(api: Api, key: ConversationKey): Promise<number> {
  const response = await send(api, `/api/conversations?${query(key)}`, { method: "GET" });
  return (await json<{ committed: number }>(response)).committed;
}

export async function uploadChunk(api: Api, meta: UploadMeta, body: Uint8Array): Promise<UploadResult> {
  const response = await send(api, `/api/conversations?${query(meta)}`, {
    method: "PUT",
    headers: { "content-type": "application/gzip" },
    body,
  });
  if (response.status === CONFLICT) {
    const { expected } = JSON.parse(await response.text()) as { expected: number };
    return { status: "conflict", expected };
  }
  return { status: "ok", committed: (await json<{ committed: number }>(response)).committed };
}

export async function issueToken(api: Api, scope: TokenScope, label: string): Promise<IssuedToken> {
  const response = await send(api, "/api/tokens", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ scope, label }),
  });
  return json<IssuedToken>(response);
}

export async function listTokens(api: Api): Promise<TokenSummary[]> {
  const response = await send(api, "/api/tokens", { method: "GET" });
  return (await json<{ tokens: TokenSummary[] }>(response)).tokens;
}

export async function revokeToken(api: Api, id: string): Promise<void> {
  const response = await send(api, `/api/tokens?${query({ id })}`, { method: "DELETE" });
  await json<unknown>(response);
}
