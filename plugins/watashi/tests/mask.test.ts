import { describe, expect, it } from "vite-plus/test";
import { betterleaksDetector, resolveBetterleaks } from "../lib/betterleaks.ts";
import type { Detector, Finding } from "../lib/betterleaks.ts";
import { MaskingIncomplete, maskText } from "../lib/mask.ts";
import { NON_SECRETS, PLACEMENTS, fakeSecrets, imageLine, nonSecretLine, pick } from "./fake-secrets.ts";

const detect = betterleaksDetector(resolveBetterleaks());

function strings(value: unknown, out: string[] = []): string[] {
  if (typeof value === "string") out.push(value);
  else if (Array.isArray(value)) for (const item of value) strings(item, out);
  else if (typeof value === "object" && value !== null)
    for (const item of Object.values(value)) strings(item, out);
  return out;
}

function decoded(text: string): string {
  return text
    .split("\n")
    .filter((line) => line !== "")
    .map((line) => strings(JSON.parse(line)).join("\n"))
    .join("\n");
}

const secrets = fakeSecrets();

describe("maskText with betterleaks", () => {
  for (const placement of PLACEMENTS) {
    for (const secret of secrets) {
      it(`${placement.name} の ${secret.name} を送信本文に残さない`, () => {
        const input = `${placement.line(secret)}\n`;
        const needle = placement.needle(secret);
        expect(decoded(input)).toContain(needle);
        const masked = maskText(input, detect);
        expect(masked.redactions).toBeGreaterThan(0);
        expect(masked.text).not.toContain(needle);
        expect(decoded(masked.text)).not.toContain(needle);
        expect(decoded(masked.text)).not.toContain(secret.value);
      });
    }
  }

  it("秘密を含む行もほかの行も JSON のまま保ち、行の数と順を変えない", () => {
    const lines = [nonSecretLine(), ...secrets.map((secret) => PLACEMENTS[0]!.line(secret))];
    const input = `${lines.join("\n")}\n`;
    const masked = maskText(input, detect);
    const out = masked.text.split("\n");
    expect(out).toHaveLength(lines.length + 1);
    expect(out.at(-1)).toBe("");
    out.slice(0, -1).forEach((line, index) => {
      const parsed = JSON.parse(line) as { uuid: string };
      expect(parsed.uuid).toBe((JSON.parse(lines[index]!) as { uuid: string }).uuid);
    });
    expect(out[0]).toBe(lines[0]);
  });

  it("ID・コミット・UUID・パス・日本語は伏せない", () => {
    const input = `${nonSecretLine()}\n`;
    const masked = maskText(input, detect);
    expect(masked.redactions).toBe(0);
    expect(masked.text).toBe(input);
    for (const value of NON_SECRETS) expect(decoded(masked.text)).toContain(value);
  });
});

const finding = (secret: string, line = 1): Finding => ({
  ruleId: "fake",
  secret,
  encoded: false,
  startLine: line,
  endLine: line,
  startColumn: 1,
  endColumn: 0,
});

describe("maskText の安全側の動き", () => {
  it("同じ秘密が何度出ても全部伏せる", () => {
    const input = `${JSON.stringify({ a: "x SECRET y SECRET", b: ["SECRET"] })}\n`;
    const detector: Detector = (text) => (text.includes("SECRET") ? [finding("SECRET")] : []);
    const masked = maskText(input, detector);
    expect(masked.redactions).toBe(3);
    expect(masked.text).not.toContain("SECRET");
    expect(masked.text).toContain("[REDACTED:fake]");
  });

  it("文字列をまたぐ検出は、その行ごと伏せて会話のつながりは残す", () => {
    const line = JSON.stringify({ type: "user", uuid: "u1", parentUuid: "u0", a: "hello", b: "world" });
    const other = JSON.stringify({ type: "assistant", uuid: "u2", message: "fine" });
    const detector: Detector = (text) =>
      text.includes("hello\nworld")
        ? [{ ...finding(""), encoded: true, startLine: 4, endLine: 5 }]
        : [];
    const masked = maskText(`${line}\n${other}\n`, detector);
    const [first, second] = masked.text.split("\n");
    expect(JSON.parse(first!)).toEqual({
      type: "watashi-redacted-line",
      originalType: "user",
      uuid: "u1",
      parentUuid: "u0",
    });
    expect(second).toBe(other);
  });

  it("どうしても消えない検出があれば送らずに失敗する", () => {
    const detector: Detector = () => [finding("ghost")];
    expect(() => maskText(`${JSON.stringify({ a: "b" })}\n`, detector)).toThrow(MaskingIncomplete);
  });

  it("画像の base64 は検査にも置き換えにも回さない", () => {
    const data = pick("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", 4000);
    const seen: string[] = [];
    const detector: Detector = (text) => {
      seen.push(text);
      return [];
    };
    const input = `${imageLine(data)}\n`;
    expect(maskText(input, detector).text).toBe(input);
    expect(seen.join("")).not.toContain(data);
  });

  it("思考の署名は検査にも置き換えにも回さず、思考の本文は検査する", () => {
    const signature = pick("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", 400);
    const seen: string[] = [];
    const detector: Detector = (text) => {
      seen.push(text);
      return text.includes("TOKEN123") ? [finding("TOKEN123")] : [];
    };
    const line = (thinking: string): string =>
      JSON.stringify({
        type: "assistant",
        message: {
          role: "assistant",
          content: [
            { type: "thinking", thinking, signature },
            { type: "redacted_thinking", data: signature },
          ],
        },
      });
    const masked = maskText(`${line("uses TOKEN123")}\n`, detector).text;
    expect(masked).toBe(`${line("uses [REDACTED:fake]")}\n`);
    expect(seen.join("")).not.toContain(signature);
  });

  it("JSON でない行もそのまま検査して伏せる", () => {
    const detector: Detector = (text) => (text.includes("TOKEN123") ? [finding("TOKEN123")] : []);
    expect(maskText("plain TOKEN123 line\n", detector).text).toBe("plain [REDACTED:fake] line\n");
  });
});
