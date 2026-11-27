import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { parseArgs } from "node:util";
import { parseSummary } from "../../gitbook-pages/scripts/build.ts";
import { escape } from "../../gitbook-pages/scripts/components.ts";
import { DARK, FONTS, LIGHT } from "../../gitbook-pages/scripts/theme.ts";

const USAGE = "usage: build.ts <deck-dir> <out-dir> [--pdf]\n  <deck-dir> holds SUMMARY.md, the slide files it links and an optional deck.css";

export type Slide = { title: string; group: string | null; source: string; className: string; body: string; notes: string };
export type Deck = { title: string; slides: Slide[]; css: string };

const NOTES = /<aside\s+class="notes"\s*>([\s\S]*?)<\/aside>/i;
const SECTION = /^\s*<section(?:\s+class="([^"]*)")?\s*>([\s\S]*)<\/section>\s*$/i;
const MEDIA: Record<string, string> = {
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
};

type Listed = { title: string; group: string | null; source: string };

function listed(entries: ReturnType<typeof parseSummary>["groups"][number]["entries"], group: string | null): Listed[] {
  return entries.flatMap(({ title, source, children }) => [{ title, group, source }, ...listed(children, group)]);
}

function readSummary(text: string): { title: string; entries: Listed[] } {
  const { title, groups } = parseSummary(text);
  return { title, entries: groups.flatMap(({ title: group, entries }) => listed(entries, group)) };
}

function inlineAssets(html: string, here: string, deckDir: string, source: string): string {
  return html.replace(/\b(src|href)="([^"]+)"/g, (whole, attr: string, ref: string) => {
    if (/^[a-z][a-z0-9+.-]*:|^#|^\//i.test(ref)) return whole;
    const file = path.join(deckDir, here, ref);
    const media = MEDIA[path.extname(file).toLowerCase()];
    if (media === undefined) throw new Error(`${source} links ${ref}; only images can be put in a single-file deck`);
    if (!existsSync(file)) throw new Error(`${source} links ${ref}, which does not exist`);
    return `${attr}="data:${media};base64,${readFileSync(file).toString("base64")}"`;
  });
}

export function readDeck(deckDir: string): Deck {
  const summaryPath = path.join(deckDir, "SUMMARY.md");
  if (!existsSync(summaryPath)) throw new Error(`${summaryPath} does not exist`);
  const { title, entries } = readSummary(readFileSync(summaryPath, "utf8"));
  const slides = entries.map(({ title: slideTitle, group, source }) => {
    const file = path.join(deckDir, source);
    if (!existsSync(file)) throw new Error(`SUMMARY.md links ${source}, which does not exist`);
    const section = SECTION.exec(readFileSync(file, "utf8"));
    if (section === null) throw new Error(`${source} must be one <section>, optionally with a class attribute`);
    const raw = inlineAssets(section[2] ?? "", path.dirname(source), deckDir, source);
    const notes = NOTES.exec(raw)?.[1]?.trim() ?? "";
    return { title: slideTitle, group, source, className: section[1] ?? "", body: raw.replace(NOTES, "").trim(), notes };
  });
  const cssPath = path.join(deckDir, "deck.css");
  return { title: title || slides[0]?.title || "Slides", slides, css: existsSync(cssPath) ? readFileSync(cssPath, "utf8") : "" };
}

const STYLE = `
:root {${LIGHT}
  --font-body: "IBM Plex Sans JP", "Hiragino Sans", "Noto Sans JP", "Yu Gothic UI", system-ui, sans-serif;
  --topbar: 52px;
  --sidebar: 272px;
}
@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) {${DARK} } }
:root[data-theme="dark"] {${DARK} }
*, *::before, *::after { box-sizing: border-box; }
html, body { height: 100%; }
body { margin: 0; background: var(--bg); color: var(--fg); font: 16px/1.7 var(--font-body); -webkit-text-size-adjust: 100%; }
button { font: inherit; color: inherit; }
:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }

.topbar { position: sticky; top: 0; z-index: 20; height: var(--topbar); display: flex; align-items: center; gap: 4px; padding: 0 max(12px, env(safe-area-inset-right, 0px)) 0 max(8px, env(safe-area-inset-left, 0px)); background: var(--bg); border-bottom: 1px solid var(--line); }
.icon-button { display: inline-flex; align-items: center; gap: 6px; height: 36px; min-width: 36px; justify-content: center; padding: 0 10px; border: 0; border-radius: 6px; background: transparent; color: var(--muted); cursor: pointer; font-size: 14px; }
.icon-button:hover { background: var(--soft); color: var(--fg); }
.icon-button svg { width: 20px; height: 20px; flex: none; }
.deck-title { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 15px; font-weight: 600; }
.counter { color: var(--muted); font-size: 13px; font-variant-numeric: tabular-nums; padding: 0 8px; }

.shell { display: grid; grid-template-columns: var(--sidebar) minmax(0, 1fr); height: calc(100dvh - var(--topbar)); }
:root[data-sidebar="closed"] .shell { grid-template-columns: 0 minmax(0, 1fr); }
.sidebar { min-width: 0; overflow: hidden auto; padding: 20px 12px 48px; background: var(--side); border-right: 1px solid var(--line); font-size: 14px; line-height: 1.5; }
:root[data-sidebar="closed"] .sidebar { visibility: hidden; }
.sidebar h2 { margin: 20px 8px 6px; font-size: 12px; font-weight: 600; letter-spacing: 0.06em; color: var(--fg); }
.sidebar h2:first-child { margin-top: 0; }
.sidebar ol { margin: 0; padding: 0; list-style: none; }
.sidebar a { display: grid; grid-template-columns: 2.2em 1fr; padding: 6px 8px; border-radius: 6px; color: var(--muted); text-decoration: none; }
.sidebar a span:first-child { font-variant-numeric: tabular-nums; }
.sidebar a:hover { background: var(--soft); color: var(--fg); }
.sidebar a[aria-current="page"] { background: color-mix(in oklab, var(--accent) 11%, var(--bg)); color: var(--accent); font-weight: 500; }

.main { min-width: 0; overflow: auto; padding: 24px clamp(16px, 4vw, 48px) 64px; }
.column { max-width: 1120px; margin: 0 auto; }
.stage { container-type: inline-size; position: relative; width: 100%; aspect-ratio: 16 / 9; overflow: hidden; border: 1px solid var(--line); border-radius: 4px; background: #fff; }
.stage .slide { position: absolute; top: 0; left: 0; transform-origin: 0 0; }
.slide { width: 1920px; height: 1080px; overflow: hidden; }
.slide > .message { position: absolute; left: var(--message-inset, 128px); right: var(--message-inset, 128px); bottom: var(--message-bottom, 72px); margin: 0; }
.slide.statement { display: flex; flex-direction: column; justify-content: center; }
.slide.statement > .message { position: static; }
@media screen { .stage .slide:not(.is-current) { display: none; } }

.pager { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 16px; }
.pager button { display: flex; flex-direction: column; gap: 2px; min-height: 64px; padding: 10px 14px; border: 1px solid var(--line); border-radius: 6px; background: var(--bg); text-align: left; cursor: pointer; }
.pager button:hover:not(:disabled) { border-color: var(--accent); }
.pager button:disabled { visibility: hidden; }
.pager .next { text-align: right; align-items: flex-end; }
.pager small { color: var(--muted); font-size: 12px; }
.pager strong { font-weight: 500; }

.notes { margin-top: 28px; padding-top: 20px; border-top: 1px solid var(--line); }
.notes h2 { margin: 0 0 8px; font-size: 13px; font-weight: 600; color: var(--muted); letter-spacing: 0.06em; }
.notes .note { display: none; font-size: 16px; line-height: 1.9; }
.notes .note.is-current { display: block; }
.notes .note p { margin: 0 0 0.8em; }

:root[data-present] .topbar, :root[data-present] .sidebar, :root[data-present] .pager, :root[data-present] .notes { display: none; }
:root[data-present] .shell { display: block; height: 100dvh; }
:root[data-present] .main { height: 100dvh; padding: 0; display: grid; place-items: center; background: #000; }
:root[data-present] .column { width: min(100vw, calc(100dvh * 16 / 9)); max-width: none; }
:root[data-present] .stage { border: 0; border-radius: 0; }

@media (max-width: 760px) {
  .shell, :root[data-sidebar="closed"] .shell { grid-template-columns: minmax(0, 1fr); }
  .sidebar { position: fixed; z-index: 25; top: var(--topbar); bottom: 0; left: 0; width: min(85vw, 320px); transform: translateX(-100%); visibility: hidden; transition: transform 0.2s ease, visibility 0.2s; }
  :root[data-drawer="open"] .sidebar { transform: none; visibility: visible; }
}

@page { size: 1920px 1080px; margin: 0; }
@media print {
  html, body { height: auto; background: #fff; }
  .topbar, .sidebar, .pager, .notes { display: none !important; }
  .shell, .main, .column { display: block; height: auto; padding: 0; margin: 0; max-width: none; overflow: visible; }
  .stage { aspect-ratio: auto; border: 0; border-radius: 0; overflow: visible; container-type: normal; }
  .stage .slide { position: relative; transform: none !important; break-after: page; }
  .stage .slide:last-child { break-after: auto; }
  * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
}
`;

const SCRIPT = `
(() => {
  const root = document.documentElement;
  const slides = [...document.querySelectorAll(".slide")];
  const notes = [...document.querySelectorAll(".note")];
  const links = [...document.querySelectorAll(".sidebar a")];
  const stage = document.querySelector(".stage");
  const prev = document.querySelector(".pager .prev");
  const next = document.querySelector(".pager .next");
  const counter = document.querySelector(".counter");
  const titles = slides.map((slide) => slide.dataset.title);
  let index = 0;
  const fit = () => {
    const scale = stage.clientWidth / 1920;
    for (const slide of slides) slide.style.transform = "scale(" + scale + ")";
  };
  const show = (to, push) => {
    index = Math.max(0, Math.min(slides.length - 1, to));
    slides.forEach((slide, i) => slide.classList.toggle("is-current", i === index));
    notes.forEach((note, i) => note.classList.toggle("is-current", i === index));
    links.forEach((link, i) => (i === index ? link.setAttribute("aria-current", "page") : link.removeAttribute("aria-current")));
    prev.disabled = index === 0;
    next.disabled = index === slides.length - 1;
    prev.querySelector("strong").textContent = titles[index - 1] ?? "";
    next.querySelector("strong").textContent = titles[index + 1] ?? "";
    counter.textContent = (index + 1) + " / " + slides.length;
    document.title = titles[index] + " · " + document.body.dataset.deck;
    if (push) history.replaceState(null, "", "#" + (index + 1));
    links[index]?.scrollIntoView({ block: "nearest" });
    delete root.dataset.drawer;
  };
  const fromHash = () => Number.parseInt(location.hash.slice(1), 10) - 1;
  links.forEach((link, i) => link.addEventListener("click", (event) => { event.preventDefault(); show(i, true); }));
  prev.addEventListener("click", () => show(index - 1, true));
  next.addEventListener("click", () => show(index + 1, true));
  document.querySelector(".sidebar-toggle").addEventListener("click", () => {
    if (matchMedia("(max-width: 760px)").matches) { if (root.dataset.drawer === "open") delete root.dataset.drawer; else root.dataset.drawer = "open"; }
    else if (root.dataset.sidebar === "closed") delete root.dataset.sidebar; else root.dataset.sidebar = "closed";
    requestAnimationFrame(fit);
  });
  const present = (on) => {
    if (on) root.dataset.present = ""; else delete root.dataset.present;
    if (on && root.requestFullscreen) root.requestFullscreen().catch(() => {});
    if (!on && document.fullscreenElement) document.exitFullscreen().catch(() => {});
    requestAnimationFrame(fit);
  };
  document.querySelector(".present").addEventListener("click", () => present(true));
  document.addEventListener("fullscreenchange", () => { if (!document.fullscreenElement && "present" in root.dataset) present(false); });
  document.addEventListener("keydown", (event) => {
    if (event.target instanceof HTMLElement && event.target.closest("input, textarea, [contenteditable]")) return;
    if (["ArrowRight", "PageDown", " "].includes(event.key)) { event.preventDefault(); show(index + 1, true); }
    else if (["ArrowLeft", "PageUp"].includes(event.key)) { event.preventDefault(); show(index - 1, true); }
    else if (event.key === "Home") show(0, true);
    else if (event.key === "End") show(slides.length - 1, true);
    else if (event.key === "Escape" && "present" in root.dataset) present(false);
  });
  addEventListener("hashchange", () => show(fromHash(), false));
  new ResizeObserver(fit).observe(stage);
  fit();
  show(Number.isNaN(fromHash()) ? 0 : fromHash(), false);
})();
`;

const ICON = {
  menu: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z"/></svg>',
  play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M8 5v14l11-7z"/></svg>',
};

export function script(deck: Deck): string {
  const text = (html: string) =>
    html
      .replace(/<\/p>\s*/gi, "\n\n")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<[^>]+>/g, "")
      .replaceAll("&lt;", "<")
      .replaceAll("&gt;", ">")
      .replaceAll("&quot;", '"')
      .replaceAll("&amp;", "&")
      .trim();
  const parts = deck.slides.map((slide, index) => `## ${index + 1}. ${slide.title}\n\n${text(slide.notes)}`);
  return `# ${deck.title}\n\n${parts.join("\n\n")}\n`;
}

export function render(deck: Deck): string {
  const groups: { title: string | null; items: { slide: Slide; index: number }[] }[] = [];
  deck.slides.forEach((slide, index) => {
    const last = groups.at(-1);
    if (last !== undefined && last.title === slide.group) last.items.push({ slide, index });
    else groups.push({ title: slide.group, items: [{ slide, index }] });
  });
  const nav = groups
    .map(
      (group) =>
        `${group.title === null ? "" : `<h2>${escape(group.title)}</h2>`}<ol>${group.items
          .map(({ slide, index }) => `<li><a href="#${index + 1}"><span>${index + 1}</span><span>${escape(slide.title)}</span></a></li>`)
          .join("")}</ol>`,
    )
    .join("");
  const slides = deck.slides
    .map((slide, index) => `<section class="${["slide", slide.className].filter(Boolean).join(" ")}" id="slide-${index + 1}" data-title="${escape(slide.title)}" aria-label="${index + 1}. ${escape(slide.title)}">${slide.body}</section>`)
    .join("\n");
  const notes = deck.slides.map((slide) => `<div class="note">${slide.notes}</div>`).join("\n");
  return `<!doctype html>
<html lang="ja">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${escape(deck.title)}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="${FONTS}">
<style>${STYLE}</style>
<style>${deck.css}</style>
</head>
<body data-deck="${escape(deck.title)}">
<header class="topbar">
<button class="icon-button sidebar-toggle" type="button" aria-label="スライド一覧">${ICON.menu}</button>
<div class="deck-title">${escape(deck.title)}</div>
<span class="counter"></span>
<button class="icon-button present" type="button" aria-label="発表">${ICON.play}</button>
</header>
<div class="shell">
<nav class="sidebar" aria-label="スライド">${nav}</nav>
<main class="main"><div class="column">
<div class="stage">
${slides}
</div>
<div class="pager">
<button class="prev" type="button"><small>前へ</small><strong></strong></button>
<button class="next" type="button"><small>次へ</small><strong></strong></button>
</div>
<section class="notes" aria-label="スピーカーノート"><h2>スピーカーノート</h2>
${notes}
</section>
</div></main>
</div>
<script>${SCRIPT}</script>
</body>
</html>
`;
}

async function writePdf(htmlPath: string, pdfPath: string): Promise<void> {
  const { chromium } = createRequire(import.meta.url)("playwright") as typeof import("playwright");
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    await page.goto(`file://${htmlPath}`, { waitUntil: "networkidle" });
    await page.emulateMedia({ media: "print" });
    await page.pdf({ path: pdfPath, width: "1920px", height: "1080px", printBackground: true, preferCSSPageSize: true });
  } finally {
    await browser.close();
  }
}

async function main(): Promise<void> {
  const { positionals, values } = parseArgs({
    args: process.argv.slice(2),
    allowPositionals: true,
    options: { pdf: { type: "boolean", default: false } },
  });
  const [source, out] = positionals;
  if (source === undefined || out === undefined) {
    process.stderr.write(`${USAGE}\n`);
    process.exit(2);
  }
  const outDir = path.resolve(out);
  mkdirSync(outDir, { recursive: true });
  const htmlPath = path.join(outDir, "index.html");
  const deck = readDeck(path.resolve(source));
  writeFileSync(htmlPath, render(deck));
  const scriptPath = path.join(outDir, "script.md");
  writeFileSync(scriptPath, script(deck));
  const result: { file_path: string; script: string; pdf?: string } = { file_path: htmlPath, script: scriptPath };
  if (values.pdf) {
    result.pdf = path.join(outDir, "slides.pdf");
    await writePdf(htmlPath, result.pdf);
  }
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
}

if (import.meta.main) await main();
