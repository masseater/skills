import { execFileSync } from "node:child_process";
import { cpSync, existsSync, lstatSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { readProperties } from "skills-ref";
import { afterAll, beforeAll, describe, expect, it } from "vite-plus/test";
import { claude as runClaude } from "./claude-cli.test.support.ts";

type NpmSource = { source: "npm"; package: string };
type MarketplaceEntry = { name: string; source: string | NpmSource };
type LocalEntry = { name: string; source: string };
type Marketplace = { name: string; plugins: MarketplaceEntry[] };
type Finding = { warnings: { path: string; message: string }[] };

const root = path.resolve(import.meta.dirname, "..");
const marketplace: Marketplace = JSON.parse(
  readFileSync(path.join(root, ".claude-plugin/marketplace.json"), "utf8"),
);
const localPlugins = marketplace.plugins.filter((p): p is LocalEntry => typeof p.source === "string");
const npmPlugins = marketplace.plugins.filter((p) => typeof p.source !== "string");
const tracked = execFileSync("git", ["ls-files", "-z", "--cached", "--others", "--exclude-standard"], {
  cwd: root,
  encoding: "utf8",
})
  .split("\0")
  .filter((f) => f !== "" && existsSync(path.join(root, f)));

let work: string;
let repo: string;
let env: NodeJS.ProcessEnv;

const claude = (args: string[]) => runClaude(args, { cwd: repo, env });

function listed(details: string, kind: string): string[] {
  const line = details.split("\n").find((l) => l.trimStart().startsWith(`${kind} (`));
  if (line === undefined) return [];
  const names = line.replace(/^\s*\S+ \(\d+\)\s*/, "").trim();
  return names === "" ? [] : names.split(", ").sort();
}

function filesOf(source: string): string[] {
  const prefix = `${path.posix.normalize(source)}/`;
  return tracked.filter((f) => f.startsWith(prefix)).map((f) => f.slice(prefix.length));
}

beforeAll(() => {
  work = mkdtempSync(path.join(tmpdir(), "plugin-manifests-"));
  repo = path.join(work, "repo");
  for (const file of tracked) {
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
  it("passes claude plugin validate with no warning but the description msch does not generate and the version plugins leave out", () => {
    const result = claude(["plugin", "validate", ".", "--json"]);
    expect(result.status, result.output).toBe(0);
    const report: { manifest: Finding; contents: Finding[] } = JSON.parse(result.output);
    const warnings = [report.manifest, ...report.contents].flatMap((entry) =>
      entry.warnings.map((warning) => `${warning.path}: ${warning.message}`),
    );
    const unexpected = warnings.filter(
      (warning) =>
        !warning.startsWith("description: No marketplace description") && !warning.includes("No version specified"),
    );
    expect(unexpected, result.output).toEqual([]);
  });

  it("is not itself a plugin", () => {
    expect(existsSync(path.join(root, ".claude-plugin/plugin.json"))).toBe(false);
  });

  it.each(npmPlugins)("$name comes from a scoped npm package", ({ source }) => {
    expect(source).toEqual({ source: "npm", package: expect.stringMatching(/^@[a-z0-9_-]+\/[a-z0-9-]+$/) });
  });

  describe.each(localPlugins)("$name", ({ name, source }) => {
    it("passes claude plugin validate with no warning but the missing version", () => {
      const result = claude(["plugin", "validate", source, "--json"]);
      expect(result.status, result.output).toBe(0);
      const report: { manifest: Finding; contents: Finding[] } = JSON.parse(result.output);
      const warnings = [report.manifest, ...report.contents].flatMap((entry) =>
        entry.warnings.map((warning) => `${warning.path}: ${warning.message}`),
      );
      const unexpected = warnings.filter((warning) => !warning.includes("No version specified"));
      expect(unexpected, result.output).toEqual([]);
    });

    it("installs from the marketplace", () => {
      const result = claude(["plugin", "install", `${name}@${marketplace.name}`, "--scope", "user"]);
      expect(result.status, result.output).toBe(0);
    });

    describe("claude.ai sync", () => {
      const files = filesOf(source);

      it("has exactly one manifest, at .claude-plugin/plugin.json", () => {
        expect(files.filter((f) => f.endsWith(".claude-plugin/plugin.json"))).toEqual([
          ".claude-plugin/plugin.json",
        ]);
      });

      it("sets no version, so that every commit reaches installed copies", () => {
        const manifest = JSON.parse(readFileSync(path.join(root, source, ".claude-plugin/plugin.json"), "utf8"));
        expect(manifest.version).toBeUndefined();
      });

      it("names the plugin within the allowed form", () => {
        const manifest = JSON.parse(readFileSync(path.join(root, source, ".claude-plugin/plugin.json"), "utf8"));
        expect(manifest.name).toBe(name);
        expect(manifest.name).toMatch(/^[\p{Ll}\p{Nd}-]{1,64}$/u);
        expect((manifest.description ?? "").length).toBeLessThanOrEqual(500);
      });

      it("ships no top-level bin/", () => {
        expect(files.filter((f) => f.startsWith("bin/"))).toEqual([]);
      });

      it("keeps paths, symlinks and sizes within the limits", () => {
        expect(files.length).toBeLessThanOrEqual(5000);
        for (const file of files) {
          expect(file).toMatch(/^[A-Za-z0-9 _.\-/(),]+$/);
          expect(file.length).toBeLessThanOrEqual(472);
          expect(file.split("/").length).toBeLessThanOrEqual(12);
          expect(file.split("/").every((part) => part.length <= 255)).toBe(true);
          expect(file.endsWith(".zip"), file).toBe(false);
          expect(lstatSync(path.join(root, source, file)).isSymbolicLink(), file).toBe(false);
        }
      });

      it("gives every SKILL.md a unique name and a description without XML tags", async () => {
        const skills = files.filter((f) => f.endsWith("/SKILL.md") || f === "SKILL.md");
        const names: string[] = [];
        for (const skill of skills) {
          const { name: skillName, description } = await readProperties(path.join(root, source, path.dirname(skill)));
          expect(skillName, skill).not.toBe("");
          expect(description, skill).not.toBe("");
          expect(`${skillName}\n${description}`, skill).not.toMatch(/<[A-Za-z][^>]*>/);
          names.push(skillName);
        }
        expect(new Set(names).size).toBe(names.length);
      });
    });
  });
});

describe("masseater-skills", () => {
  it("loads every skill and every agent in the plugin", () => {
    const entry = localPlugins.find((p) => p.name === "masseater-skills");
    expect(entry).toBeDefined();
    const pluginRoot = path.join(root, entry?.source ?? "");
    const installed = claude(["plugin", "install", `masseater-skills@${marketplace.name}`, "--scope", "user"]);
    expect(installed.status, installed.output).toBe(0);
    const details = claude(["plugin", "details", `masseater-skills@${marketplace.name}`]);
    expect(details.status, details.output).toBe(0);

    const skills = readdirSync(path.join(pluginRoot, "skills"), { withFileTypes: true })
      .filter((d) => d.isDirectory() && existsSync(path.join(pluginRoot, "skills", d.name, "SKILL.md")))
      .map((d) => d.name)
      .sort();
    const agentsRoot = path.join(pluginRoot, "agents");
    const agents = (existsSync(agentsRoot) ? readdirSync(agentsRoot) : [])
      .filter((f) => f.endsWith(".md"))
      .map((f) => f.slice(0, -".md".length))
      .sort();

    expect(skills.length).toBeGreaterThan(0);
    expect(listed(details.output, "Skills"), details.output).toEqual(skills);
    expect(listed(details.output, "Agents"), details.output).toEqual(agents);
  });
});
