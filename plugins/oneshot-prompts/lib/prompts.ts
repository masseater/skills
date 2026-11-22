import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

export const promptsRoot = path.resolve(import.meta.dirname, "../prompts");

export type Prompt = { id: string; level: number; text: string };

export function loadPrompts(): Prompt[] {
  return readdirSync(promptsRoot, { recursive: true, encoding: "utf8" })
    .filter((file) => file.endsWith(".txt"))
    .map((file) => {
      const id = file.split(path.sep).join("/").slice(0, -".txt".length);
      const level = Number(/^l(\d)-/.exec(id)?.[1] ?? 0);
      return { id, level, text: readFileSync(path.join(promptsRoot, file), "utf8") };
    })
    .sort((a, b) => a.id.localeCompare(b.id));
}
