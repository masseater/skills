import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";

const root = join(import.meta.dirname, "..");
const kitSource = join(root, "libs/plugin-kit/src");
const pluginsDir = join(root, "plugins");
const KIT_IMPORT = /from\s+["'](?:\.\.?\/)+dist\/kit\/([\w-]+)(?:\.ts)?["']/g;
const LOCAL_IMPORT = /from\s+["']\.\/([\w-]+)(?:\.ts)?["']/g;

function namesIn(text: string, pattern: RegExp): string[] {
  return [...text.matchAll(pattern)].flatMap((match) => (match[1] === undefined ? [] : [match[1]]));
}

function sourceFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const file = join(dir, entry.name);
    if (entry.isDirectory()) return entry.name === "node_modules" || entry.name === "dist" ? [] : sourceFiles(file);
    return /\.tsx?$/.test(entry.name) ? [file] : [];
  });
}

function closure(wanted: string[]): string[] {
  const seen = new Set<string>();
  const queue = [...wanted];
  for (let name = queue.pop(); name !== undefined; name = queue.pop()) {
    if (seen.has(name)) continue;
    const file = join(kitSource, `${name}.ts`);
    if (!existsSync(file)) throw new Error(`libs/plugin-kit/src/${name}.ts does not exist`);
    seen.add(name);
    queue.push(...namesIn(readFileSync(file, "utf8"), LOCAL_IMPORT));
  }
  return [...seen].sort();
}

function plugins(): string[] {
  return readdirSync(pluginsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && existsSync(join(pluginsDir, entry.name, ".claude-plugin/plugin.json")))
    .map((entry) => entry.name)
    .sort();
}

function wanted(plugin: string): string[] {
  return closure(sourceFiles(join(pluginsDir, plugin)).flatMap((file) => namesIn(readFileSync(file, "utf8"), KIT_IMPORT)));
}

function expected(plugin: string): Map<string, string> {
  return new Map(wanted(plugin).map((name) => [`${name}.ts`, readFileSync(join(kitSource, `${name}.ts`), "utf8")]));
}

const check = process.argv.includes("--check");
const stage = process.argv.includes("--stage");
const stale: string[] = [];
const touched: string[] = [];

for (const plugin of plugins()) {
  const dir = join(pluginsDir, plugin, "dist/kit");
  const files = expected(plugin);
  const present = existsSync(dir) ? readdirSync(dir) : [];
  for (const name of present.filter((file) => !files.has(file))) {
    stale.push(relative(root, join(dir, name)));
    if (!check) rmSync(join(dir, name), { force: true });
  }
  for (const [name, content] of files) {
    const file = join(dir, name);
    if (existsSync(file) && readFileSync(file, "utf8") === content) continue;
    stale.push(relative(root, file));
    if (!check) {
      mkdirSync(dir, { recursive: true });
      writeFileSync(file, content);
    }
  }
  if (!check && files.size === 0) rmSync(join(pluginsDir, plugin, "dist"), { recursive: true, force: true });
  touched.push(relative(root, join(pluginsDir, plugin, "dist")));
}

if (check && stale.length > 0) {
  console.error(`dist/kit is out of date: ${stale.join(", ")}. Run \`vp run kit\`.`);
  process.exit(1);
}
if (!check && stage && stale.length > 0) execFileSync("git", ["add", "-A", "--", ...touched], { cwd: root });
for (const file of stale) console.log(check ? `stale ${file}` : `wrote ${file}`);
