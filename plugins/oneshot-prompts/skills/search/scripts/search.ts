import { parseArgs } from "node:util";
import { loadPrompts, type Prompt } from "../../../lib/prompts.ts";

const USAGE = "usage: search.ts [--level <1-4>] [keywords...]\n       search.ts show <id>";
const PREVIEW_LENGTH = 60;

function preview(text: string): string {
  const first = text.split("\n")[0] ?? "";
  return first.length > PREVIEW_LENGTH ? `${first.slice(0, PREVIEW_LENGTH)}…` : first;
}

function search(prompts: Prompt[], keywords: string[], level: number | undefined): string[] {
  const needles = keywords.map((keyword) => keyword.toLowerCase());
  return prompts
    .filter((prompt) => level === undefined || prompt.level === level)
    .filter((prompt) => {
      const haystack = `${prompt.id}\n${prompt.text}`.toLowerCase();
      return needles.every((needle) => haystack.includes(needle));
    })
    .map((prompt) => `${prompt.id}\tL${prompt.level}\t${preview(prompt.text)}`);
}

const { values, positionals } = parseArgs({
  args: process.argv.slice(2),
  options: { level: { type: "string" } },
  allowPositionals: true,
});
const prompts = loadPrompts();

if (positionals[0] === "show") {
  const prompt = prompts.find((candidate) => candidate.id === positionals[1]);
  if (!prompt) {
    console.error(`no prompt with id ${positionals[1] ?? "(none)"}\n${USAGE}`);
    process.exit(1);
  }
  process.stdout.write(prompt.text);
} else {
  const level = values.level === undefined ? undefined : Number(values.level);
  if (level !== undefined && !Number.isInteger(level)) {
    console.error(USAGE);
    process.exit(1);
  }
  const lines = search(prompts, positionals, level);
  if (lines.length === 0) {
    console.error("no prompts matched");
    process.exit(1);
  }
  console.log(lines.join("\n"));
}
