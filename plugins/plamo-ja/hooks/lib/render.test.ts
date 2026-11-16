import { describe, expect, it } from "vite-plus/test";
import { looksBroken, renderLines, splitLines, translatableUnits } from "./render.ts";
import { emptyMessageState } from "./schema.ts";

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

  it("見出しの次の行は見出しに含めず、別に訳す", async () => {
    const out = await renderLines(
      splitLines("## The idea\nClaude writes in English.\nPLaMo translates it.\n"),
      fresh(),
      fake,
    );
    expect(out).toBe("## JA(The idea)\nJA(Claude writes in English. PLaMo translates it.)\n");
  });

  it("太字だけの行は次の行とまとめず、1 行で訳す", async () => {
    const out = await renderLines(
      splitLines("**Cause**\nThe refresh ran twice.\n**Fix:**\n- Run it once.\n"),
      fresh(),
      fake,
    );
    expect(out).toBe(
      "JA(**Cause**)\nJA(The refresh ran twice.)\nJA(**Fix:**)\n- JA(Run it once.)\n",
    );
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

describe("進捗の印", () => {
  it("✓ ✱ ○ で始まる行は 1 行ずつ訳し、印を残す", async () => {
    const out = await renderLines(splitLines("✓ Done.\n✱ Doing.\n○ Later.\n"), fresh(), fake);
    expect(out).toBe("✓ JA(Done.)\n✱ JA(Doing.)\n○ JA(Later.)\n");
  });
});

describe("translatableUnits", () => {
  it("訳す本文だけを返し、リンク先の URL は英字に数えない", () => {
    expect(translatableUnits("Merged.\n\nテストは通った\n")).toEqual(["Merged."]);
    expect(looksBroken("[#1087](https://github.com/masseater/masseater.dev/pull/1087)", "[#1087](https://github.com/masseater/masseater.dev/pull/1087)")).toBe(false);
  });
});

describe("looksBroken", () => {
  it("長い英文の訳に日本語が無ければ壊れているとみなす", () => {
    const en = "This sentence is long enough to need a Japanese translation here.";
    expect(looksBroken(en, en)).toBe(true);
    expect(looksBroken(en, "この文は日本語に訳す必要があるほど長い。")).toBe(false);
  });
});
