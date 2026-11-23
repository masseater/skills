import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import path from "node:path";
import { parseArgs } from "node:util";
import { readDeck, render } from "./build.ts";

const USAGE = "usage: preview.ts <deck-dir> <png>\n  writes every slide of the deck as one tiled PNG";
const COLUMNS = 3;
const TILE = 480;

async function main(): Promise<void> {
  const { positionals } = parseArgs({ args: process.argv.slice(2), allowPositionals: true });
  const [source, out] = positionals;
  if (source === undefined || out === undefined) {
    process.stderr.write(`${USAGE}\n`);
    process.exit(2);
  }
  const deck = readDeck(path.resolve(source));
  const work = mkdtempSync(path.join(tmpdir(), "gitbook-slides-"));
  const htmlPath = path.join(work, "index.html");
  writeFileSync(htmlPath, render(deck));
  const { chromium } = createRequire(import.meta.url)("playwright") as typeof import("playwright");
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
    await page.goto(`file://${htmlPath}`, { waitUntil: "networkidle" });
    await page.emulateMedia({ media: "print" });
    const shots: string[] = [];
    for (const slide of await page.locator(".slide").all()) shots.push((await slide.screenshot()).toString("base64"));
    const tiles = deck.slides
      .map((slide, index) => `<figure><img src="data:image/png;base64,${shots[index]}"><figcaption>${index + 1}. ${slide.title.replaceAll("<", "&lt;")}</figcaption></figure>`)
      .join("");
    await page.emulateMedia({ media: "screen" });
    await page.setViewportSize({ width: COLUMNS * (TILE + 24) + 24, height: 400 });
    await page.setContent(`<style>body{margin:0;padding:24px;background:#e9ebe8;font:16px system-ui,sans-serif;color:#1d2424}main{display:grid;grid-template-columns:repeat(${COLUMNS},${TILE}px);gap:24px}figure{margin:0}img{display:block;width:${TILE}px;border:1px solid #cfd4cf}figcaption{margin-top:8px}</style><main>${tiles}</main>`);
    await page.screenshot({ path: path.resolve(out), fullPage: true });
  } finally {
    await browser.close();
    rmSync(work, { recursive: true, force: true });
  }
}

if (import.meta.main) await main();
