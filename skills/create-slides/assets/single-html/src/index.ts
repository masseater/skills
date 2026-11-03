import path from "node:path";
import { pathToFileURL } from "node:url";

import react from "@vitejs/plugin-react";
import { chromium } from "playwright";
import type { LaunchOptions } from "playwright";
import { viteSingleFile } from "vite-plugin-singlefile";
import { defineConfig } from "vite-plus";
import type { ConfigEnv, Plugin, UserConfig, ViteUserConfigFnObject } from "vite-plus";

const launchOptions = (): LaunchOptions => {
  const chromiumPath = process.env["SLIDES_CHROMIUM_PATH"];
  if (typeof chromiumPath === "string") {
    return { executablePath: chromiumPath };
  }
  return {};
};

const renderPdf = async (htmlPath: string, pdfPath: string): Promise<void> => {
  const browser = await chromium.launch(launchOptions());
  try {
    const page = await browser.newPage({ colorScheme: "light" });
    await page.goto(pathToFileURL(htmlPath).href, { waitUntil: "load" });
    await page.emulateMedia({ media: "print" });
    await page.evaluate(() => document.fonts.ready);
    await page.pdf({ path: pdfPath, preferCSSPageSize: true, printBackground: true });
  } finally {
    await browser.close();
  }
};

type Page = Readonly<{ title: string; script: string; style: string; htmlPath: string }>;

type Output = Page & Readonly<{ pdfPath: string }>;

type Decks = Readonly<Record<string, Page | Output>>;

const nameHtml = (outDir: string, { htmlPath }: Page): Plugin => ({
  name: "name-html",
  apply: "build",
  enforce: "post",
  generateBundle: (_options, bundle): void => {
    for (const file of Object.values(bundle)) {
      if (file.fileName.endsWith(".html")) {
        file.fileName = path.relative(outDir, htmlPath);
      }
    }
  },
});

const pageHead = ({ title, script, style }: Page): Plugin => ({
  name: "page-head",
  transformIndexHtml: {
    order: "pre",
    handler: () => [
      { tag: "title", children: title, injectTo: "head" },
      { tag: "link", attrs: { rel: "stylesheet", href: style }, injectTo: "head" },
      { tag: "script", attrs: { type: "module", src: script }, injectTo: "body" },
    ],
  },
});

const emitPdf = ({ htmlPath, pdfPath }: Output): Plugin => ({
  name: "emit-pdf",
  apply: "build",
  closeBundle: async (): Promise<void> => {
    await renderPdf(htmlPath, pdfPath);
  },
});

const buildTasks = (names: readonly string[]): Record<string, { command: string[] }> =>
  Object.fromEntries(
    names.map((name) => [`build:${name}`, { command: ["tsc", `vp build --mode ${name}`] }]),
  );

const pdfPlugins = (entry: Page | Output): Plugin[] => {
  if ("pdfPath" in entry) {
    return [emitPdf(entry)];
  }
  return [];
};

type Paths = Readonly<{ entryPath: string; outDir: string }>;

const deckConfig = ({ entryPath, outDir }: Paths, entry: Page | Output | undefined): UserConfig => {
  if (typeof entry !== "object") {
    return { plugins: [react()], build: { outDir, emptyOutDir: false } };
  }
  return {
    plugins: [
      react(),
      pageHead(entry),
      viteSingleFile(),
      nameHtml(outDir, entry),
      ...pdfPlugins(entry),
    ],
    build: { outDir, emptyOutDir: false, rolldownOptions: { input: entryPath } },
  };
};

const singleHtmlConfig = (
  paths: Paths,
  decks: Decks,
  define: Readonly<Record<string, string>>,
): ViteUserConfigFnObject => {
  const names = Object.keys(decks);
  return defineConfig(({ mode }: Readonly<ConfigEnv>) => ({
    ...deckConfig(paths, decks[mode]),
    define,
    run: {
      tasks: {
        ...buildTasks(names),
        build: {
          command: ["tsc", ...names.map((name) => `vp build --mode ${name}`)],
          cache: { untrackedEnv: ["PLAYWRIGHT_BROWSERS_PATH", "SLIDES_CHROMIUM_PATH"] },
        },
      },
    },
  }));
};

export { singleHtmlConfig };
export type { Decks, Output, Page, Paths };
