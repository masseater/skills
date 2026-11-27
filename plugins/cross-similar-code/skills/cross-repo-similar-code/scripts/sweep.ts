import { spawnSync } from "node:child_process";
import { copyFileSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { isRecord, parseJson } from "../../../dist/kit/record.ts";
import { ensureRuntime, runtimeRoot } from "../../../hooks/lib/runtime.ts";

const SOURCE = /\.(?:[cm]?[jt]sx?|vue|svelte|astro)$/;
const IGNORE = [
  "**/*.test.*",
  "**/*.spec.*",
  "**/*.d.ts",
  "**/fixtures/**",
  "**/patches/**",
  "**/generated/**",
  "**/dist/**",
  "**/vendor/**",
];
const PROBE_FILE = "no-such-file.ts";
const SEED_BATCH = 40;
const EMBED_ATTEMPTS = 8;

export type Unit = { repo: string; dir: string; shallow: boolean; files: string[] };
export type Side = { path: string; name: string; startLine: number; endLine: number };
export type Pair = { similarity: number; left: Side; right: Side };
type Completion = { capped: boolean; embedded: boolean; compared: boolean; reasons: string[] };

export function sourceFiles(listing: string): string[] {
  return listing
    .split("\0")
    .filter((file) => SOURCE.test(file))
    .sort();
}

export function split(unit: Unit): Unit[] {
  const children = new Map<string, string[]>();
  const loose: string[] = [];
  for (const file of unit.files) {
    const rest = unit.dir === "" ? file : file.slice(unit.dir.length + 1);
    const slash = rest.indexOf("/");
    if (slash === -1) {
      loose.push(file);
      continue;
    }
    const dir = unit.dir === "" ? rest.slice(0, slash) : `${unit.dir}/${rest.slice(0, slash)}`;
    children.set(dir, [...(children.get(dir) ?? []), file]);
  }
  const subs = [...children].map(([dir, files]) => ({ repo: unit.repo, dir, shallow: false, files }));
  return loose.length > 0 ? [...subs, { ...unit, shallow: true, files: loose }] : subs;
}

export function splittable(unit: Unit): boolean {
  return !unit.shallow && unit.files.some((file) => file.slice(unit.dir === "" ? 0 : unit.dir.length + 1).includes("/"));
}

function numberAt(value: unknown, key: string): number {
  return isRecord(value) && typeof value[key] === "number" ? value[key] : 0;
}

export function readCompletion(report: unknown): Completion {
  const completion = isRecord(report) ? report.completion : undefined;
  const phases = isRecord(completion) && Array.isArray(completion.phases) ? completion.phases : [];
  const phase = (name: string) => phases.find((p) => isRecord(p) && p.phase === name);
  const status = (name: string) => (isRecord(phase(name)) ? (phase(name) as Record<string, unknown>).status : "missing");
  const limit = isRecord(completion) ? numberAt(completion.limits, "max_functions") : 0;
  const extracted = numberAt(phase("extraction"), "processed");
  const reasons = ["embedding", "comparison"].filter((name) => status(name) !== "complete").map((n) => `${n} ${String(status(n))}`);
  return {
    capped: limit > 0 && extracted >= limit,
    embedded: status("embedding") === "complete",
    compared: status("comparison") === "complete",
    reasons,
  };
}

function sideOf(value: unknown): Side | undefined {
  if (!isRecord(value) || typeof value.path !== "string" || typeof value.name !== "string") return undefined;
  return { path: value.path, name: value.name, startLine: numberAt(value, "start_line"), endLine: numberAt(value, "end_line") };
}

export function readPairs(report: unknown): Pair[] {
  const candidates = isRecord(report) && Array.isArray(report.candidates) ? report.candidates : [];
  return candidates.flatMap((c) => {
    const left = isRecord(c) ? sideOf(c.left) : undefined;
    const right = isRecord(c) ? sideOf(c.right) : undefined;
    return left && right && isRecord(c) ? [{ similarity: numberAt(c, "similarity"), left, right }] : [];
  });
}

export function repoOf(file: string): string {
  return file.split("/")[0] ?? "";
}

export function crossRepo(pairs: Pair[]): Pair[] {
  const seen = new Set<string>();
  return pairs.filter((pair) => {
    if (repoOf(pair.left.path) === repoOf(pair.right.path)) return false;
    const key = [pair.left, pair.right]
      .map((s) => `${s.path}:${s.startLine}`)
      .sort()
      .join("|");
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function largest(units: Unit[]): Unit | undefined {
  return units.toSorted((a, b) => b.files.length - a.files.length)[0];
}

class Work {
  readonly dir: string;
  readonly bin: string;
  private counter = 0;

  constructor(dir: string, bin: string) {
    this.dir = dir;
    this.bin = bin;
  }

  materialize(units: Unit[], clones: Map<string, string>): void {
    rmSync(this.dir, { recursive: true, force: true });
    mkdirSync(this.dir, { recursive: true });
    writeFileSync(path.join(this.dir, ".fallowrc.jsonc"), JSON.stringify({ similarCode: { ignore: IGNORE } }));
    for (const unit of units) {
      const from = clones.get(unit.repo) ?? "";
      for (const file of unit.files) {
        const to = path.join(this.dir, unit.repo, file);
        mkdirSync(path.dirname(to), { recursive: true });
        copyFileSync(path.join(from, file), to);
      }
    }
  }

  run(files: string[]): { report: unknown; completion: Completion } {
    const out = path.join(this.dir, `.report-${this.counter++}.json`);
    const args = ["similar-code", "--format", "json", "--quiet", "-o", out, ...files.flatMap((f) => ["--file", f])];
    spawnSync(this.bin, args, { cwd: this.dir, stdio: "ignore", timeout: 1_000_000 });
    const report = parseJson(readFileSync(out, "utf8"));
    return { report, completion: readCompletion(report) };
  }
}

export type Plan = { roots: Unit[][]; unresolved: Unit[][] };

export function plan(units: Unit[], capped: (units: Unit[]) => boolean): Plan {
  const repos = new Set(units.map((u) => u.repo));
  if (repos.size < 2) return { roots: [], unresolved: [] };
  if (!capped(units)) return { roots: [units], unresolved: [] };
  if (units.length > 2) {
    const pairs = units.flatMap((a, i) => units.slice(i + 1).filter((b) => b.repo !== a.repo).map((b) => [a, b]));
    return merge(pairs.map((pair) => plan(pair, capped)));
  }
  const biggest = largest(units);
  if (!biggest || !splittable(biggest)) return { roots: [], unresolved: [units] };
  const other = units.filter((u) => u !== biggest);
  return merge(split(biggest).map((child) => plan([child, ...other], capped)));
}

function merge(plans: Plan[]): Plan {
  return { roots: plans.flatMap((p) => p.roots), unresolved: plans.flatMap((p) => p.unresolved) };
}

function seedsOf(units: Unit[]): string[] {
  const skip = largest(units);
  return units.filter((u) => u !== skip).flatMap((u) => u.files.map((f) => `${u.repo}/${f}`));
}

function sweepRoot(work: Work, units: Unit[], clones: Map<string, string>): { pairs: Pair[]; failed: string[] } {
  work.materialize(units, clones);
  const seeds = seedsOf(units);
  const pairs: Pair[] = [];
  const failed: string[] = [];
  let size = SEED_BATCH;
  for (let at = 0; at < seeds.length; ) {
    const batch = seeds.slice(at, at + size);
    let result = work.run(batch);
    for (let attempt = 1; attempt < EMBED_ATTEMPTS && !result.completion.embedded; attempt++) result = work.run(batch);
    const { completion, report } = result;
    if (!completion.embedded) {
      failed.push(...completion.reasons);
      at += batch.length;
    } else if (!completion.compared && batch.length > 1) {
      size = Math.max(1, Math.floor(batch.length / 2));
    } else {
      if (!completion.compared) failed.push(...completion.reasons);
      pairs.push(...readPairs(report));
      at += batch.length;
    }
  }
  return { pairs, failed };
}

function parseArgs(argv: string[]): { reposDir: string; out: string } {
  const value = (flag: string) => argv[argv.indexOf(flag) + 1];
  const reposDir = value("--repos");
  const out = value("--out");
  if (!reposDir || !out) throw new Error("usage: node sweep.ts --repos <directory of checkouts> --out <result.json>");
  return { reposDir: path.resolve(reposDir), out: path.resolve(out) };
}

function listFiles(clone: string): string[] {
  const result = spawnSync("git", ["-C", clone, "ls-files", "-z"], { encoding: "utf8", maxBuffer: 1 << 28 });
  return sourceFiles(result.stdout);
}

async function main(): Promise<void> {
  const { reposDir, out } = parseArgs(process.argv.slice(2));
  const clones = new Map(
    readdirSync(reposDir, { withFileTypes: true })
      .filter((entry) => entry.isDirectory() && !entry.name.startsWith("."))
      .map((entry) => [entry.name, path.join(reposDir, entry.name)] as const),
  );
  const units: Unit[] = [...clones].map(([repo, clone]) => ({ repo, dir: "", shallow: false, files: listFiles(clone) }));
  const root = runtimeRoot();
  const bin = await ensureRuntime(root);
  const work = new Work(path.join(root, "work"), bin);
  const capped = (candidate: Unit[]): boolean => {
    work.materialize(candidate, clones);
    return work.run([PROBE_FILE]).completion.capped;
  };
  const { roots, unresolved } = plan(units, capped);
  const pairs: Pair[] = [];
  const failed: string[] = [];
  for (const unitsOfRoot of roots) {
    const result = sweepRoot(work, unitsOfRoot, clones);
    pairs.push(...result.pairs);
    failed.push(...result.failed);
  }
  const incomplete = failed.length > 0 || unresolved.length > 0;
  const describe = (u: Unit[]) => u.map((x) => `${[x.repo, x.dir].filter((part) => part !== "").join("/")}${x.shallow ? " (top files)" : ""}`);
  writeFileSync(
    out,
    JSON.stringify(
      {
        complete: !incomplete,
        roots: roots.map(describe),
        unresolved: unresolved.map(describe),
        failedPhases: [...new Set(failed)],
        pairs: crossRepo(pairs).sort((a, b) => b.similarity - a.similarity),
      },
      undefined,
      2,
    ),
  );
  process.exitCode = incomplete ? 1 : 0;
}

if (process.argv[1] === import.meta.filename) await main();
