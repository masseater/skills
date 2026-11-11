import type { ViteUserConfigFnObject } from "vite-plus";
type Page = Readonly<{
    title: string;
    script: string;
    style: string;
    htmlPath: string;
}>;
type Output = Page & Readonly<{
    pdfPath: string;
}>;
type Decks = Readonly<Record<string, Page | Output>>;
type Paths = Readonly<{
    entryPath: string;
    outDir: string;
}>;
declare const singleHtmlConfig: (paths: Paths, decks: Decks, define: Readonly<Record<string, string>>) => ViteUserConfigFnObject;
export { singleHtmlConfig };
export type { Decks, Output, Page, Paths };
