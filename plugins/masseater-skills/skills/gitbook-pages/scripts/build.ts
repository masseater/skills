import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { parseArgs } from "node:util";
import { Blocks, type Context, type Link, type NavGroup, type NavItem, Page, type TocEntry } from "./components.ts";
import { parseMarkdown, plainText } from "./markdown.ts";
import { FONTS, SCRIPT, STYLE } from "./theme.ts";

const USAGE = "usage: build.ts <source-dir> <out-dir>\n  <source-dir> holds SUMMARY.md and the pages it links";

type Entry = { title: string; source: string; children: Entry[] };
type Summary = { title: string; groups: { title: string | null; entries: Entry[] }[] };
type Flat = { entry: Entry; file: string; trail: string[] };

const LINK_ITEM = /^(\s*)[-*+]\s+\[([^\]]+)\]\(([^)\s]+)\)\s*$/;

export function parseSummary(text: string): Summary {
  const summary: Summary = { title: "", groups: [] };
  const stack: { indent: number; entry: Entry }[] = [];
  for (const line of text.replaceAll("\r\n", "\n").split("\n")) {
    const heading = /^(#{1,3})\s+(.+?)\s*$/.exec(line);
    if (heading !== null) {
      if (heading[1] === "#" && summary.title === "") summary.title = heading[2] ?? "";
      else summary.groups.push({ title: heading[2] ?? "", entries: [] });
      stack.length = 0;
      continue;
    }
    const item = LINK_ITEM.exec(line);
    if (item === null) continue;
    const indent = item[1]?.length ?? 0;
    const entry: Entry = { title: plainText(item[2] ?? ""), source: decodeURI(item[3] ?? ""), children: [] };
    while (stack.length > 0 && (stack.at(-1)?.indent ?? 0) >= indent) stack.pop();
    const parent = stack.at(-1);
    if (parent !== undefined) parent.entry.children.push(entry);
    else {
      if (summary.groups.length === 0) summary.groups.push({ title: null, entries: [] });
      summary.groups.at(-1)?.entries.push(entry);
    }
    stack.push({ indent, entry });
  }
  if (summary.groups.every((group) => group.entries.length === 0)) throw new Error("SUMMARY.md links no pages");
  return summary;
}

function fileNameOf(source: string, index: number, used: Set<string>): string {
  if (index === 0) return "index.html";
  const base = source
    .replace(/\.md$/i, "")
    .replace(/[\\/]+/g, "-")
    .replace(/[^A-Za-z0-9_-]/g, "")
    .replace(/^-+|-+$/g, "");
  let name = base === "" || base === "index" ? `page-${index + 1}` : base;
  while (used.has(`${name}.html`)) name = `${name}-${index + 1}`;
  return `${name}.html`;
}

function flatten(summary: Summary): Flat[] {
  const out: Flat[] = [];
  const used = new Set<string>();
  const walk = (entries: Entry[], trail: string[]) => {
    for (const entry of entries) {
      const file = fileNameOf(entry.source, out.length, used);
      used.add(file);
      out.push({ entry, file, trail });
      walk(entry.children, [...trail, entry.title]);
    }
  };
  for (const group of summary.groups) walk(group.entries, group.title === null ? [] : [group.title]);
  return out;
}

function slugger(): (text: string) => string {
  const seen = new Map<string, number>();
  return (text) => {
    const base =
      text
        .trim()
        .toLowerCase()
        .replace(/[^\p{L}\p{N}\s_-]/gu, "")
        .replace(/\s+/g, "-") || "section";
    const count = seen.get(base) ?? 0;
    seen.set(base, count + 1);
    return count === 0 ? base : `${base}-${count + 1}`;
  };
}

export type Built = { files: Map<string, string>; assets: Map<string, string> };

export function build(sourceDir: string): Built {
  const summaryPath = path.join(sourceDir, "SUMMARY.md");
  if (!existsSync(summaryPath)) throw new Error(`${summaryPath} does not exist`);
  const summary = parseSummary(readFileSync(summaryPath, "utf8"));
  const pages = flatten(summary);
  const bySource = new Map(pages.map((page) => [path.posix.normalize(page.entry.source), page.file]));
  const navOf = (entries: Entry[]): NavItem[] =>
    entries.map((entry) => ({
      title: entry.title,
      file: bySource.get(path.posix.normalize(entry.source)) ?? "",
      children: navOf(entry.children),
    }));
  const groups: NavGroup[] = summary.groups.map((group) => ({ title: group.title, items: navOf(group.entries) }));
  const files = new Map<string, string>();
  const assets = new Map<string, string>();

  pages.forEach((page, index) => {
    const sourcePath = path.join(sourceDir, page.entry.source);
    if (!existsSync(sourcePath)) throw new Error(`SUMMARY.md links ${page.entry.source}, which does not exist`);
    const here = path.posix.dirname(page.entry.source);
    const blocks = parseMarkdown(readFileSync(sourcePath, "utf8"));
    const first = blocks[0];
    const pageTitle = first?.type === "heading" && first.level === 1 ? plainText(first.text) : page.entry.title;
    const body = first?.type === "heading" && first.level === 1 ? blocks.slice(1) : blocks;
    const ctx: Context = {
      slug: slugger(),
      resolve: (href) => {
        if (/^[a-z][a-z0-9+.-]*:|^#|^\//i.test(href)) return href;
        const [target = "", hash] = href.split("#");
        if (!/\.md$/i.test(target)) {
          const asset = path.posix.normalize(path.posix.join(here, target));
          const published = `assets/${asset.replace(/[\\/]+/g, "-").replace(/^\.+-?/, "")}`;
          assets.set(published, path.join(sourceDir, asset));
          return published;
        }
        const file = bySource.get(path.posix.normalize(path.posix.join(here, decodeURI(target))));
        if (file === undefined) throw new Error(`${page.entry.source} links ${target}, which SUMMARY.md does not list`);
        return hash === undefined ? file : `${file}#${hash}`;
      },
    };
    const toc: TocEntry[] = [];
    const html = Blocks({ blocks: body, ctx, toc });
    const neighbour = (other: Flat | undefined): Link | null => (other === undefined ? null : { title: other.entry.title, file: other.file });
    files.set(
      page.file,
      Page({
        docTitle: summary.title || pageTitle,
        pageTitle,
        standalone: index !== 0,
        groups,
        current: page.file,
        trail: page.trail,
        toc,
        body: html,
        prev: neighbour(pages[index - 1]),
        next: neighbour(pages[index + 1]),
        style: STYLE,
        script: SCRIPT,
        fonts: FONTS,
      }).html,
    );
  });
  return { files, assets };
}

function main(): void {
  const { positionals } = parseArgs({ args: process.argv.slice(2), allowPositionals: true });
  const [source, out] = positionals;
  if (source === undefined || out === undefined) {
    process.stderr.write(`${USAGE}\n`);
    process.exit(2);
  }
  const built = build(path.resolve(source));
  const outDir = path.resolve(out);
  mkdirSync(path.join(outDir, "assets"), { recursive: true });
  for (const [name, html] of built.files) writeFileSync(path.join(outDir, name), html);
  for (const [name, from] of built.assets) {
    if (!existsSync(from)) throw new Error(`${from} is linked but does not exist`);
    copyFileSync(from, path.join(outDir, name));
  }
  const extra = [...built.files.keys(), ...built.assets.keys()].filter((name) => name !== "index.html");
  const publish = {
    file_path: path.join(outDir, "index.html"),
    files: Object.fromEntries(extra.map((name) => [name, path.join(outDir, name)])),
  };
  process.stdout.write(`${JSON.stringify(publish, null, 2)}\n`);
}

if (import.meta.main) main();
