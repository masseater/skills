import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const START = "<!-- skills:start -->";
const END = "<!-- skills:end -->";
const SKILLS_REF = "skills-ref@0.1.5";

const root = join(import.meta.dirname, "..");
const readmePath = join(root, "README.md");

const lines = readdirSync(join(root, "skills"), { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && existsSync(join(root, "skills", entry.name, "SKILL.md")))
  .map((entry) => entry.name)
  .sort()
  .map((dir) => {
    const json = execFileSync("npx", ["-y", SKILLS_REF, "read-properties", join(root, "skills", dir)], {
      encoding: "utf8",
    });
    const { name, description } = JSON.parse(json);
    return `- [${name}](skills/${dir}/SKILL.md): ${description.replace(/\s*\n\s*/g, " ").trim()}`;
  });

const readme = readFileSync(readmePath, "utf8");
const start = readme.indexOf(START);
const end = readme.indexOf(END);
if (start === -1 || end === -1 || end < start) {
  throw new Error(`README.md に ${START} と ${END} の区間がない`);
}

const next = `${readme.slice(0, start + START.length)}\n\n${lines.join("\n")}\n\n${readme.slice(end)}`;

if (process.argv.includes("--check")) {
  if (next !== readme) {
    console.error("README.md のスキル一覧が古い。node scripts/update-readme.mjs で書き直す。");
    process.exit(1);
  }
} else if (next !== readme) {
  writeFileSync(readmePath, next);
  console.log("README.md のスキル一覧を書き直した。");
}
