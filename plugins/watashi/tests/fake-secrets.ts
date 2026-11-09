import { generateKeyPairSync, randomBytes, randomInt } from "node:crypto";

const ALNUM = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const LOWER_ALNUM = "abcdefghijklmnopqrstuvwxyz0123456789";
const UPPER_B32 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
const HEX = "0123456789abcdef";
const URL_SAFE = `${ALNUM}_-`;

export function pick(alphabet: string, length: number): string {
  let out = "";
  while (out.length < length) out += alphabet[randomInt(alphabet.length)];
  return out;
}

function mixed(alphabet: string, length: number): string {
  for (;;) {
    const value = pick(alphabet, length);
    if (/[A-Z]/u.test(value) && /[a-z]/u.test(value) && /[0-9]/u.test(value)) return value;
  }
}

const base64url = (value: string | Buffer): string => Buffer.from(value).toString("base64url");

function jwt(): string {
  const header = base64url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = base64url(JSON.stringify({ sub: pick(ALNUM, 24), iat: 1_800_000_000 }));
  return `${header}.${payload}.${base64url(randomBytes(32))}`;
}

function privateKey(): string {
  const { privateKey: key } = generateKeyPairSync("ec", { namedCurve: "P-256" });
  return key.export({ type: "pkcs8", format: "pem" }).toString();
}

export type FakeSecret = { name: string; value: string; context: string };

export function fakeSecrets(): FakeSecret[] {
  const ghp = `ghp_${mixed(ALNUM, 36)}`;
  return [
    { name: "github-pat", value: ghp, context: "GitHub のトークン" },
    {
      name: "github-fine-grained-pat",
      value: `github_pat_${mixed(ALNUM, 22)}_${mixed(ALNUM, 59)}`,
      context: "fine-grained token",
    },
    {
      name: "anthropic-api-key",
      value: `sk-ant-api03-${mixed(URL_SAFE, 93)}AA`,
      context: "ANTHROPIC_API_KEY",
    },
    {
      name: "openai-api-key",
      value: `sk-proj-${mixed(URL_SAFE, 74)}T3BlbkFJ${mixed(URL_SAFE, 74)}`,
      context: "OpenAI",
    },
    { name: "openrouter-api-key", value: `sk-or-v1-${pick(HEX, 64)}`, context: "OpenRouter" },
    { name: "npm-access-token", value: `npm_${pick(LOWER_ALNUM, 35)}7`, context: "npm" },
    {
      name: "slack-bot-token",
      value: `xoxb-${pick("0123456789", 12)}-${pick("0123456789", 13)}-${mixed(ALNUM, 24)}`,
      context: "Slack",
    },
    { name: "stripe-access-token", value: `sk_live_${mixed(ALNUM, 32)}`, context: "Stripe" },
    { name: "aws-access-token", value: `AKIA${pick(UPPER_B32, 16)}`, context: "AWS" },
    { name: "gcp-api-key", value: `AIza${mixed(URL_SAFE, 35)}`, context: "Google" },
    { name: "cloudflare-api-token", value: mixed(URL_SAFE, 40), context: "cloudflare token" },
    { name: "bare-pasted-token", value: mixed(ALNUM, 48), context: "これ使って" },
    { name: "watashi-token", value: `wat_${mixed(URL_SAFE, 43)}`, context: "WATASHI_TOKEN" },
    { name: "jwt", value: jwt(), context: "Authorization: Bearer" },
    { name: "private-key", value: privateKey(), context: "秘密鍵" },
  ];
}

export const NON_SECRETS = [
  "session_016oXHvbRuDsuwvKb5awn1Je",
  "toolu_01Ftbo4HaN52fuViLMsXZeG3",
  "cmsg_01VnfVNDJjs1GVr2sSFsGFguWtZ2TXDkE56zJjaDLXFVxg",
  "979820b5c0a7f3e2d1c4b6a8e9f0123456789abc",
  "6df4989a-c0a7-5129-89d5-965ab358d4fe",
  "/home/user/masseater.dev/apps/watashi-mcp/src/features/mcp/api/endpoint.server.ts",
  "apps/watashi-mcp/src/features/mcp/api/conversation-writer.server.ts",
  "会話履歴を watashi-mcp に取り込む",
];

let sequence = 0;

const ids = (): { uuid: string; parentUuid: string; timestamp: string; sessionId: string } => {
  sequence += 1;
  return {
    uuid: `00000000-0000-4000-8000-${String(sequence).padStart(12, "0")}`,
    parentUuid: `00000000-0000-4000-8000-${String(sequence - 1).padStart(12, "0")}`,
    timestamp: "2026-11-09T14:35:33.548Z",
    sessionId: "6df4989a-c0a7-5129-89d5-965ab358d4fe",
  };
};

export type Placement = {
  name: string;
  line: (secret: FakeSecret) => string;
  needle: (secret: FakeSecret) => string;
};

const plain = ({ value }: FakeSecret): string => value;

const encoded = ({ value }: FakeSecret): string => Buffer.from(`token=${value}`).toString("base64");

export const PLACEMENTS: Placement[] = [
  {
    name: "user message",
    line: ({ value, context }) =>
      JSON.stringify({
        type: "user",
        ...ids(),
        message: { role: "user", content: `${context} これ使って ${value} で叩いて` },
      }),
    needle: plain,
  },
  {
    name: "Bash tool input",
    line: ({ value }) =>
      JSON.stringify({
        type: "assistant",
        ...ids(),
        message: {
          role: "assistant",
          content: [
            {
              type: "tool_use",
              id: "toolu_01Ftbo4HaN52fuViLMsXZeG3",
              name: "Bash",
              input: { command: `export API_TOKEN='${value}' && curl -s https://example.com` },
            },
          ],
        },
      }),
    needle: plain,
  },
  {
    name: "multi-line tool result",
    line: ({ value }) =>
      JSON.stringify({
        type: "user",
        ...ids(),
        message: {
          role: "user",
          content: [
            {
              type: "tool_result",
              tool_use_id: "toolu_01Ftbo4HaN52fuViLMsXZeG3",
              content: `line one\nSECRET_TOKEN=${value}\nline three`,
            },
          ],
        },
      }),
    needle: plain,
  },
  {
    name: "JSON inside a string",
    line: ({ value }) =>
      JSON.stringify({
        type: "user",
        ...ids(),
        toolUseResult: { stdout: JSON.stringify({ credentials: { token: value } }) },
      }),
    needle: ({ value }) => JSON.stringify(value).slice(1, -1),
  },
  {
    name: "base64 encoded",
    line: (secret) =>
      JSON.stringify({
        type: "user",
        ...ids(),
        message: { role: "user", content: `encoded: ${encoded(secret)}` },
      }),
    needle: encoded,
  },
];

export function nonSecretLine(): string {
  return JSON.stringify({
    type: "assistant",
    ...ids(),
    message: { role: "assistant", content: NON_SECRETS.join("\n") },
  });
}

export function imageLine(data: string): string {
  return JSON.stringify({
    type: "user",
    ...ids(),
    message: {
      role: "user",
      content: [{ type: "image", source: { type: "base64", media_type: "image/png", data } }],
    },
  });
}
