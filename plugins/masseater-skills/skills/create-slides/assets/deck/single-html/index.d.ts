import type { ViteUserConfigFnObject } from "vite-plus";
export type Page = Readonly<{
    title: string;
    script: string;
    style: string;
    htmlPath: string;
}>;
export type Output = Page & Readonly<{
    pdfPath: string;
}>;
export type Decks = Readonly<Record<string, Page | Output>>;
export type Paths = Readonly<{
    entryPath: string;
    outDir: string;
}>;
export declare const singleHtmlConfig: (paths: Paths, decks: Decks, define: Readonly<Record<string, string>>) => ViteUserConfigFnObject;
