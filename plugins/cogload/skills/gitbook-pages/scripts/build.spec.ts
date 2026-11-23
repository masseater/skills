import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vite-plus/test";
import { build, parseSummary } from "./build.ts";
import { parseInline, parseMarkdown } from "./markdown.ts";

describe("parseMarkdown", () => {
  it("keeps a bullet list and a following numbered list apart", () => {
    const blocks = parseMarkdown("- a\n  - b\n- c\n\n1. one\n2. two");
    expect(blocks.map((block) => block.type === "list" && block.ordered)).toEqual([false, true]);
  });

  it("turns a GitHub alert into a callout", () => {
    expect(parseMarkdown("> [!WARNING]\n> careful")).toEqual([
      { type: "callout", kind: "warning", children: [{ type: "paragraph", text: "careful" }] },
    ]);
  });

  it("reads a table with alignment and an escaped pipe", () => {
    expect(parseMarkdown("| a | b |\n| :-- | --: |\n| x \\| y | 1 |")).toEqual([
      { type: "table", align: ["left", "right"], head: ["a", "b"], rows: [["x | y", "1"]] },
    ]);
  });

  it("joins Japanese lines without a space and English lines with one", () => {
    expect(parseMarkdown("日本語の\n文章\n\nan\nexample")).toEqual([
      { type: "paragraph", text: "日本語の文章" },
      { type: "paragraph", text: "an example" },
    ]);
  });

  it("leaves underscores inside words alone", () => {
    expect(parseInline("snake_case_name")).toEqual([{ type: "text", text: "snake_case_name" }]);
  });
});

describe("build", () => {
  let dir = "";
  afterEach(() => rmSync(dir, { recursive: true, force: true }));

  function write(files: Record<string, string>): string {
    dir = mkdtempSync(path.join(tmpdir(), "gitbook-pages-"));
    for (const [name, text] of Object.entries(files)) {
      mkdirSync(path.dirname(path.join(dir, name)), { recursive: true });
      writeFileSync(path.join(dir, name), text);
    }
    return dir;
  }

  it("makes one page per SUMMARY entry, the first as the published page", () => {
    const built = build(
      write({
        "SUMMARY.md": "# Doc\n\n## Start\n\n* [Intro](intro.md)\n  * [Child](sub/child.md)\n",
        "intro.md": "# Intro\n\nSee [child](sub/child.md#part).\n\n## Part\n",
        "sub/child.md": "# Child\n\n## Part\n",
      }),
    );
    expect([...built.files.keys()]).toEqual(["index.html", "sub-child.html"]);
    const index = built.files.get("index.html") ?? "";
    expect(index.startsWith("<title>Doc</title>")).toBe(true);
    expect(index).toContain('href="sub-child.html#part"');
    expect(index).toContain('<a href="#part">Part</a>');
    const child = built.files.get("sub-child.html") ?? "";
    expect(child.startsWith("<!doctype html>")).toBe(true);
    expect(child).toContain('<a class="pager-prev" href="index.html" rel="prev">');
    expect(child).toContain("<li>Start</li><li>");
  });

  it("refuses a link to a page SUMMARY.md does not list", () => {
    const source = write({ "SUMMARY.md": "* [A](a.md)\n", "a.md": "[b](b.md)\n" });
    expect(() => build(source)).toThrow("b.md, which SUMMARY.md does not list");
  });

  it("reads nesting from indentation", () => {
    const summary = parseSummary("# T\n\n* [A](a.md)\n  * [B](b.md)\n* [C](c.md)\n");
    expect(summary.groups[0]?.entries.map((entry) => [entry.title, entry.children.length])).toEqual([
      ["A", 1],
      ["C", 0],
    ]);
  });
});
