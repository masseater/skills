import { describe, expect, it } from "vite-plus/test";
import { looksBroken, renderLines, splitLines } from "../hooks/lib/render.ts";
import { emptyMessageState } from "../hooks/lib/schema.ts";

const fake = async (sources: string[]) => sources.map((en) => `JA(${en})`);
const fresh = emptyMessageState;

describe("renderLines", () => {
  it("段落の続く行を 1 つにまとめて訳し、空行はそのまま残す", async () => {
    const out = await renderLines(
      splitLines("First line\ncontinues here.\n\nNext.\n"),
      fresh(),
      fake,
    );
    expect(out).toBe("JA(First line continues here.)\n\nJA(Next.)\n");
  });

  it("見出しと箇条書きは記号を残して本文だけを訳す", async () => {
    const out = await renderLines(
      splitLines("## Result\n- It works.\n1. Run it.\n"),
      fresh(),
      fake,
    );
    expect(out).toBe("## JA(Result)\n- JA(It works.)\n1. JA(Run it.)\n");
  });

  it("コードフェンスと表は訳さない", async () => {
    const text = "```ts\nconst a = 1;\n```\n| a | b |\n";
    expect(await renderLines(splitLines(text), fresh(), fake)).toBe(text);
  });

  it("フェンスが開いたままの状態をバッチをまたいで持ち越す", async () => {
    const state = fresh();
    await renderLines(splitLines("```\n"), state, fake);
    expect(state.fence).toBe("```");
    expect(await renderLines(splitLines("echo hi\n```\nDone.\n"), state, fake)).toBe(
      "echo hi\n```\nJA(Done.)\n",
    );
    expect(state.fence).toBeNull();
  });

  it("末尾に改行の無い行も改行を足さずに出す", async () => {
    expect(await renderLines(splitLines("Partial"), fresh(), fake)).toBe("JA(Partial)");
  });
});

describe("訳すかどうかの判定", () => {
  it("英文は訳し、コードだけの行と日本語の行は訳さない", async () => {
    const text = "The test passed.\n\n`vp run check`\n\nテストは `vp check` で通った\n";
    expect(await renderLines(splitLines(text), fresh(), fake)).toBe(
      "JA(The test passed.)\n\n`vp run check`\n\nテストは `vp check` で通った\n",
    );
  });
});

describe("looksBroken", () => {
  it("長い英文の訳に日本語が無ければ壊れているとみなす", () => {
    const en = "This sentence is long enough to need a Japanese translation here.";
    expect(looksBroken(en, en)).toBe(true);
    expect(looksBroken(en, "この文は日本語に訳す必要があるほど長い。")).toBe(false);
  });
});
