import { createHash } from "node:crypto";
import { mkdtempSync, rmSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vite-plus/test";
import { freshAccessToken, loadCredentials, login, saveCredentials } from "../lib/oauth.ts";

const BASE = "https://watashi.test";

const dirs: string[] = [];
afterEach(() => {
  for (const dir of dirs.splice(0)) rmSync(dir, { recursive: true, force: true });
});

const home = (): string => {
  const dir = mkdtempSync(path.join(tmpdir(), "watashi-oauth-"));
  dirs.push(dir);
  return dir;
};

function fakeAuthServer() {
  const forms: URLSearchParams[] = [];
  let challenge = "";
  let refreshCount = 0;
  const fetchImpl = async (input: string | URL | Request, init?: RequestInit): Promise<Response> => {
    const url = new URL(String(input));
    if (url.pathname === "/.well-known/oauth-protected-resource/mcp") {
      return Response.json({ resource: `${BASE}/mcp`, authorization_servers: [`${BASE}/api/auth`] });
    }
    if (url.pathname === "/.well-known/oauth-authorization-server/api/auth") {
      return Response.json({
        authorization_endpoint: `${BASE}/api/auth/oauth2/authorize`,
        token_endpoint: `${BASE}/api/auth/oauth2/token`,
        registration_endpoint: `${BASE}/api/auth/oauth2/register`,
      });
    }
    if (url.pathname === "/api/auth/oauth2/register") {
      const body = JSON.parse(String(init?.body)) as { redirect_uris: string[]; token_endpoint_auth_method: string };
      expect(body.token_endpoint_auth_method).toBe("none");
      expect(body.redirect_uris[0]).toMatch(/^http:\/\/127\.0\.0\.1:\d+\/callback$/u);
      return Response.json({ client_id: "client-1" }, { status: 201 });
    }
    if (url.pathname === "/api/auth/oauth2/token") {
      const form = new URLSearchParams(String(init?.body));
      forms.push(form);
      if (form.get("grant_type") === "authorization_code") {
        const digest = createHash("sha256").update(form.get("code_verifier") ?? "").digest("base64url");
        if (digest !== challenge || form.get("code") !== "code-1") return new Response("bad", { status: 400 });
        return Response.json({ access_token: "access-1", refresh_token: "refresh-1", expires_in: 3600 });
      }
      refreshCount += 1;
      return Response.json({ access_token: `access-r${refreshCount}`, refresh_token: `refresh-r${refreshCount}`, expires_in: 3600 });
    }
    return new Response("not found", { status: 404 });
  };
  const approve = (authorizeUrl: string): void => {
    const url = new URL(authorizeUrl);
    challenge = url.searchParams.get("code_challenge") ?? "";
    expect(url.searchParams.get("code_challenge_method")).toBe("S256");
    expect(url.searchParams.get("resource")).toBe(`${BASE}/mcp`);
    const redirect = new URL(url.searchParams.get("redirect_uri") ?? "");
    redirect.searchParams.set("code", "code-1");
    redirect.searchParams.set("state", url.searchParams.get("state") ?? "");
    void fetch(redirect);
  };
  return { fetchImpl: fetchImpl as typeof fetch, approve, forms };
}

describe("OAuth ログイン", () => {
  it("動的登録と PKCE でトークンを取り、本人だけが読めるファイルに保存する", async () => {
    const dir = home();
    const server = fakeAuthServer();
    const credentials = await login(dir, BASE, server.fetchImpl, () => undefined, server.approve);
    expect(credentials.accessToken).toBe("access-1");
    expect(loadCredentials(dir)?.refreshToken).toBe("refresh-1");
    expect(statSync(path.join(dir, "oauth.json")).mode & 0o777).toBe(0o600);
    expect(server.forms[0]?.get("resource")).toBe(`${BASE}/mcp`);
  });

  it("期限が近ければリフレッシュトークンで取り直して保存する", async () => {
    const dir = home();
    const server = fakeAuthServer();
    saveCredentials(dir, {
      tokenEndpoint: `${BASE}/api/auth/oauth2/token`,
      clientId: "client-1",
      resource: `${BASE}/mcp`,
      accessToken: "old",
      refreshToken: "refresh-1",
      expiresAt: Date.now() + 10_000,
    });
    expect(await freshAccessToken(dir, server.fetchImpl)).toBe("access-r1");
    expect(loadCredentials(dir)?.refreshToken).toBe("refresh-r1");
    expect(await freshAccessToken(dir, server.fetchImpl)).toBe("access-r1");
  });

  it("ログインしていなければ何も返さない", async () => {
    expect(await freshAccessToken(home(), fakeAuthServer().fetchImpl)).toBeUndefined();
  });
});
