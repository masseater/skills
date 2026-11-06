import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vite-plus/test";
import { TRANSLATED_FIELDS, translateToolInput } from "../hooks/lib/tool-input.ts";

const upper = async (text: string) => text.toUpperCase();

describe("translateToolInput", () => {
  it("決まった場所の文字列だけを訳し、元の入力は書き換えない", async () => {
    const input = {
      questions: [
        {
          question: "Which one?",
          header: "Pick",
          options: [
            { label: "a", description: "first" },
            { label: "b", description: "second" },
          ],
        },
      ],
    };
    const { value, changed } = await translateToolInput(
      input,
      TRANSLATED_FIELDS.AskUserQuestion ?? [],
      upper,
    );
    expect(changed).toBe(true);
    expect(value).toEqual({
      questions: [
        {
          question: "WHICH ONE?",
          header: "Pick",
          options: [
            { label: "A", description: "FIRST" },
            { label: "B", description: "SECOND" },
          ],
        },
      ],
    });
    expect(input.questions[0]?.question).toBe("Which one?");
  });

  it("訳が変わらなければ changed は false", async () => {
    const { changed } = await translateToolInput({ text: "済み" }, ["text"], async (t) => t);
    expect(changed).toBe(false);
  });

  it("hooks.json の matcher は訳すツールと同じ並び", () => {
    const hooks = JSON.parse(
      readFileSync(path.join(import.meta.dirname, "../hooks/hooks.json"), "utf8"),
    ) as { hooks: { PreToolUse: { matcher: string }[] } };
    const matcher = new RegExp(hooks.hooks.PreToolUse[0]?.matcher ?? "");
    for (const tool of Object.keys(TRANSLATED_FIELDS)) expect(matcher.test(tool)).toBe(true);
    expect(matcher.test("mcp__hearthbot__request_decision")).toBe(false);
    expect(matcher.test("Bash")).toBe(false);
  });
});
