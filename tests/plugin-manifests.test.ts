import { execFileSync, spawnSync } from "node:child_process";
import { cpSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vite-plus/test";

type MarketplaceEntry = { name: string; source: string };
type Marketplace = { name: string; plugins: MarketplaceEntry[] };

const root = path.resolve(import.meta.dirname, "..");
const marketplace: Marketplace = JSON.parse(
  readFileSync(path.join(root, ".claude-plugin/marketplace.json"), "utf8"),
);
const claudeBin = path.join(root, "node_modules/.bin/claude");

let work: string;
let repo: string;
let env: NodeJS.ProcessEnv;

function claude(args: string[]): { status: number | null; output: string } {
  const result = spawnSync(claudeBin, args, { env, encoding: "utf8", cwd: repo });
  return { status: result.status, output: `${result.stdout}${result.stderr}` };
}

function listed(details: string, kind: string): string[] {
  const line = details.split("\n").find((l) => l.trimStart().startsWith(`${kind} (`));
  if (line === undefined) return [];
  const names = line.replace(/^\s*\S+ \(\d+\)\s*/, "").trim();
  return names === "" ? [] : names.split(", ").sort();
}

beforeAll(() => {
  work = mkdtempSync(path.join(tmpdir(), "plugin-manifests-"));
  repo = path.join(work, "repo");
  const files = execFileSync("git", ["ls-files", "-z", "--cached", "--others", "--exclude-standard"], {
    cwd: root,
    encoding: "utf8",
  })
    .split("\0")
    .filter((f) => f !== "" && existsSync(path.join(root, f)));
  for (const file of files) {
    mkdirSync(path.dirname(path.join(repo, file)), { recursive: true });
    cpSync(path.join(root, file), path.join(repo, file), { verbatimSymlinks: true });
  }
  env = { ...process.env, CLAUDE_CONFIG_DIR: path.join(work, "config") };
  const added = claude(["plugin", "marketplace", "add", repo]);
  expect(added.status, added.output).toBe(0);
});

afterAll(() => {
  rmSync(work, { recursive: true, force: true });
});

describe("marketplace", () => {
  it("passes claude plugin validate --strict", () => {
    const result = claude(["plugin", "validate", "--strict", "."]);
    expect(result.status, result.output).toBe(0);
  });

  describe.each(marketplace.plugins)("$name", ({ name, source }) => {
    it("passes claude plugin validate --strict", () => {
      const result = claude(["plugin", "validate", "--strict", source]);
      expect(result.status, result.output).toBe(0);
    });

    it("installs from the marketplace", () => {
      const result = claude(["plugin", "install", `${name}@${marketplace.name}`, "--scope", "user"]);
      expect(result.status, result.output).toBe(0);
    });
  });
});

describe("masseater-skills", () => {
  it("loads every skill in skills/ and every agent in agents/", () => {
    const entry = marketplace.plugins.find((p) => p.name === "masseater-skills");
    expect(entry?.source).toBe("./");
    const installed = claude(["plugin", "install", `masseater-skills@${marketplace.name}`, "--scope", "user"]);
    expect(installed.status, installed.output).toBe(0);
    const details = claude(["plugin", "details", `masseater-skills@${marketplace.name}`]);
    expect(details.status, details.output).toBe(0);

    const skills = readdirSync(path.join(root, "skills"), { withFileTypes: true })
      .filter((d) => d.isDirectory() && existsSync(path.join(root, "skills", d.name, "SKILL.md")))
      .map((d) => d.name)
      .sort();
    const agents = readdirSync(path.join(root, "agents"))
      .filter((f) => f.endsWith(".md"))
      .map((f) => f.slice(0, -".md".length))
      .sort();

    expect(skills.length).toBeGreaterThan(0);
    expect(listed(details.output, "Skills"), details.output).toEqual(skills);
    expect(listed(details.output, "Agents"), details.output).toEqual(agents);
  });
});
