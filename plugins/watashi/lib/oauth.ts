import { spawn } from "node:child_process";
import { createHash, randomBytes } from "node:crypto";
import { chmodSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { createServer } from "node:http";
import type { AddressInfo } from "node:net";
import path from "node:path";
import type { Fetch } from "./api.ts";
import { RESOURCE_PATH } from "./config.ts";

export type OAuthCredentials = {
  tokenEndpoint: string;
  clientId: string;
  resource: string;
  accessToken: string;
  refreshToken: string | null;
  expiresAt: number;
};

type TokenResponse = { access_token: string; refresh_token?: string; expires_in?: number };

const SCOPE = "openid profile offline_access";
const REFRESH_MARGIN_MS = 60_000;
const DEFAULT_EXPIRES_IN = 3600;
const LOGIN_TIMEOUT_MS = 10 * 60 * 1000;

const credentialsPath = (home: string): string => path.join(home, "oauth.json");

export function loadCredentials(home: string): OAuthCredentials | undefined {
  try {
    return JSON.parse(readFileSync(credentialsPath(home), "utf8")) as OAuthCredentials;
  } catch {
    return undefined;
  }
}

export function saveCredentials(home: string, credentials: OAuthCredentials): void {
  mkdirSync(home, { recursive: true });
  const target = credentialsPath(home);
  writeFileSync(target, JSON.stringify(credentials, null, 2), { mode: 0o600 });
  chmodSync(target, 0o600);
}

export function forgetCredentials(home: string): void {
  rmSync(credentialsPath(home), { force: true });
}

async function postForm(fetchImpl: Fetch, url: string, form: Record<string, string>): Promise<TokenResponse> {
  const response = await fetchImpl(url, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded", accept: "application/json" },
    body: new URLSearchParams(form).toString(),
  });
  const body = await response.text();
  if (!response.ok) throw new Error(`token endpoint responded ${response.status}: ${body.slice(0, 500)}`);
  return JSON.parse(body) as TokenResponse;
}

const toCredentials = (
  base: Omit<OAuthCredentials, "accessToken" | "refreshToken" | "expiresAt">,
  token: TokenResponse,
  previousRefresh: string | null,
  now: number,
): OAuthCredentials => ({
  ...base,
  accessToken: token.access_token,
  refreshToken: token.refresh_token ?? previousRefresh,
  expiresAt: now + (token.expires_in ?? DEFAULT_EXPIRES_IN) * 1000,
});

export async function freshAccessToken(home: string, fetchImpl: Fetch, now = Date.now()): Promise<string | undefined> {
  const credentials = loadCredentials(home);
  if (credentials === undefined) return undefined;
  if (credentials.expiresAt - REFRESH_MARGIN_MS > now) return credentials.accessToken;
  if (credentials.refreshToken === null) return undefined;
  try {
    const token = await postForm(fetchImpl, credentials.tokenEndpoint, {
      grant_type: "refresh_token",
      refresh_token: credentials.refreshToken,
      client_id: credentials.clientId,
      resource: credentials.resource,
    });
    const next = toCredentials(credentials, token, credentials.refreshToken, now);
    saveCredentials(home, next);
    return next.accessToken;
  } catch (error) {
    const reloaded = loadCredentials(home);
    if (reloaded !== undefined && reloaded.expiresAt - REFRESH_MARGIN_MS > now) return reloaded.accessToken;
    throw error;
  }
}

async function getJson<Value>(fetchImpl: Fetch, url: string): Promise<Value> {
  const response = await fetchImpl(url, { headers: { accept: "application/json" } });
  if (!response.ok) throw new Error(`${url} responded ${response.status}`);
  return (await response.json()) as Value;
}

type ServerMetadata = {
  authorization_endpoint: string;
  token_endpoint: string;
  registration_endpoint: string;
};

export async function discover(fetchImpl: Fetch, baseUrl: string): Promise<ServerMetadata & { resource: string }> {
  const resource = await getJson<{ resource: string; authorization_servers: string[] }>(
    fetchImpl,
    `${baseUrl}/.well-known/oauth-protected-resource${RESOURCE_PATH}`,
  );
  const issuer = new URL(resource.authorization_servers[0] ?? baseUrl);
  const metadata = await getJson<ServerMetadata>(
    fetchImpl,
    `${issuer.origin}/.well-known/oauth-authorization-server${issuer.pathname.replace(/\/$/u, "")}`,
  );
  return { ...metadata, resource: resource.resource };
}

const base64url = (buffer: Buffer): string => buffer.toString("base64url");

function openBrowser(url: string): void {
  const command =
    process.platform === "darwin" ? ["open", url] : process.platform === "win32" ? ["rundll32", "url.dll,FileProtocolHandler", url] : ["xdg-open", url];
  const [file, ...args] = command;
  if (file === undefined) return;
  try {
    spawn(file, args, { detached: true, stdio: "ignore" }).on("error", () => undefined).unref();
  } catch {
    return;
  }
}

type Callback = { redirectUri: string; code: Promise<string>; close: () => void };

async function listenForCode(expectedState: string): Promise<Callback> {
  let resolveCode: (code: string) => void = () => undefined;
  let rejectCode: (error: Error) => void = () => undefined;
  const code = new Promise<string>((resolve, reject) => {
    resolveCode = resolve;
    rejectCode = reject;
  });
  const server = createServer((request, response) => {
    const url = new URL(request.url ?? "/", "http://127.0.0.1");
    if (url.pathname !== "/callback") {
      response.writeHead(404).end();
      return;
    }
    const error = url.searchParams.get("error");
    const received = url.searchParams.get("code");
    response.writeHead(200, { "content-type": "text/plain; charset=utf-8" });
    if (error !== null || received === null || url.searchParams.get("state") !== expectedState) {
      response.end("ログインできませんでした。ターミナルを見てください。");
      rejectCode(new Error(`authorization failed: ${error ?? "state mismatch"}`));
      return;
    }
    response.end("ログインできました。このタブは閉じてかまいません。");
    resolveCode(received);
  });
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const { port } = server.address() as AddressInfo;
  const timer = setTimeout(() => rejectCode(new Error("login timed out")), LOGIN_TIMEOUT_MS);
  return {
    redirectUri: `http://127.0.0.1:${port}/callback`,
    code,
    close: () => {
      clearTimeout(timer);
      server.close();
    },
  };
}

export async function login(
  home: string,
  baseUrl: string,
  fetchImpl: Fetch,
  announce: (url: string) => void,
  open: (url: string) => void = openBrowser,
): Promise<OAuthCredentials> {
  const metadata = await discover(fetchImpl, baseUrl);
  const state = base64url(randomBytes(16));
  const callback = await listenForCode(state);
  try {
    const registration = await fetchImpl(metadata.registration_endpoint, {
      method: "POST",
      headers: { "content-type": "application/json", accept: "application/json" },
      body: JSON.stringify({
        client_name: "watashi CLI",
        redirect_uris: [callback.redirectUri],
        grant_types: ["authorization_code", "refresh_token"],
        response_types: ["code"],
        token_endpoint_auth_method: "none",
        scope: SCOPE,
      }),
    });
    const registered = (await registration.json()) as { client_id?: string };
    if (!registration.ok || registered.client_id === undefined) {
      throw new Error(`client registration failed: ${registration.status}`);
    }
    const verifier = base64url(randomBytes(32));
    const challenge = base64url(createHash("sha256").update(verifier).digest());
    const authorize = new URL(metadata.authorization_endpoint);
    authorize.search = new URLSearchParams({
      response_type: "code",
      client_id: registered.client_id,
      redirect_uri: callback.redirectUri,
      scope: SCOPE,
      state,
      code_challenge: challenge,
      code_challenge_method: "S256",
      resource: metadata.resource,
      prompt: "consent",
    }).toString();
    announce(authorize.toString());
    open(authorize.toString());
    const code = await callback.code;
    const token = await postForm(fetchImpl, metadata.token_endpoint, {
      grant_type: "authorization_code",
      code,
      redirect_uri: callback.redirectUri,
      client_id: registered.client_id,
      code_verifier: verifier,
      resource: metadata.resource,
    });
    const credentials = toCredentials(
      { tokenEndpoint: metadata.token_endpoint, clientId: registered.client_id, resource: metadata.resource },
      token,
      null,
      Date.now(),
    );
    saveCredentials(home, credentials);
    return credentials;
  } finally {
    callback.close();
  }
}
