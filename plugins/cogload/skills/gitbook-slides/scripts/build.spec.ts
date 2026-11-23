import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vite-plus/test";
import { readDeck, render } from "./build.ts";

const dirs: string[] = [];

function deck(files: Record<string, string>): string {
  const dir = mkdtempSync(path.join(tmpdir(), "gitbook-slides-spec-"));
  dirs.push(dir);
  for (const [name, text] of Object.entries(files)) {
    mkdirSync(path.dirname(path.join(dir, name)), { recursive: true });
    writeFileSync(path.join(dir, name), text);
  }
  return dir;
}

afterEach(() => {
  for (const dir of dirs.splice(0)) rmSync(dir, { recursive: true, force: true });
});

describe("readDeck", () => {
  it("keeps the order and groups of SUMMARY.md and splits off the notes", () => {
    const read = readDeck(
      deck({
        "SUMMARY.md": "# Deck\n\n* [Cover](a.html)\n\n## Part\n\n* [Body](b.html)\n",
        "a.html": '<section class="cover"><h1>A</h1></section>',
        "b.html": '<section><p>B</p><aside class="notes"><p>say B</p></aside></section>',
      }),
    );
    expect(read.slides.map(({ title, group, className, notes }) => ({ title, group, className, notes }))).toEqual([
      { title: "Cover", group: null, className: "cover", notes: "" },
      { title: "Body", group: "Part", className: "", notes: "<p>say B</p>" },
    ]);
    expect(read.slides[1]?.body).toBe("<p>B</p>");
  });

  it("puts an image into the HTML so the deck stays one file", () => {
    const read = readDeck(
      deck({
        "SUMMARY.md": "* [One](one.html)\n",
        "one.html": '<section><img src="img/dot.svg" alt=""></section>',
        "img/dot.svg": '<svg xmlns="http://www.w3.org/2000/svg"/>',
      }),
    );
    expect(read.slides[0]?.body).toMatch(/src="data:image\/svg\+xml;base64,/);
  });

  it("refuses a slide that is not one section", () => {
    const dir = deck({ "SUMMARY.md": "* [One](one.html)\n", "one.html": "<h1>loose</h1>" });
    expect(() => readDeck(dir)).toThrow(/one <section>/);
  });

  it("refuses a link to a slide that does not exist", () => {
    const dir = deck({ "SUMMARY.md": "* [One](missing.html)\n" });
    expect(() => readDeck(dir)).toThrow(/missing\.html/);
  });
});

describe("render", () => {
  it("writes every slide, its notes and its sidebar entry into one page", () => {
    const html = render({
      title: "Deck",
      css: ".slide{}",
      slides: [{ title: "A", group: "G", source: "a.html", className: "cover", body: "<h1>A</h1>", notes: "<p>n</p>" }],
    });
    expect(html).toContain('<section class="slide cover" id="slide-1" data-title="A"');
    expect(html).toContain('<div class="note"><p>n</p></div>');
    expect(html).toContain("<h2>G</h2>");
  });
});
