import { readFileSync, writeFileSync } from "node:fs";

const [source, destination, title] = process.argv.slice(2);
if (source === undefined || destination === undefined || title === undefined) {
  console.error("usage: wrap-artifact.ts <single-file-index.html> <artifact.html> <title>");
  process.exit(1);
}

const html = readFileSync(source, "utf8");
const blocks = (tag: string): string[] =>
  [...html.matchAll(new RegExp(`<${tag}\\b[^>]*>[\\s\\S]*?</${tag}>`, "g"))].map((match) => match[0]);
const body = /<body[^>]*>([\s\S]*)<\/body>/.exec(html)?.[1]?.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, "") ?? "";

writeFileSync(destination, [`<title>${title}</title>`, ...blocks("style"), body, ...blocks("script")].join("\n"));
