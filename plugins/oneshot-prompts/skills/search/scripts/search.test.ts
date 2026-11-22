import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vite-plus/test";

const script = path.join(import.meta.dirname, "search.ts");
const promptsRoot = path.resolve(import.meta.dirname, "../../../prompts");

function run(...args: string[]): { status: number | null; stdout: string; stderr: string } {
  const { status, stdout, stderr } = spawnSync(process.execPath, [script, ...args], { encoding: "utf8" });
  return { status, stdout, stderr };
}

describe("search", () => {
  it("lists every level for a keyword", () => {
    const { status, stdout } = run("EC");
    expect(status).toBe(0);
    const levels = stdout
      .trim()
      .split("\n")
      .map((line) => line.split("\t")[1]);
    expect(levels).toEqual(["L1", "L2", "L3", "L4"]);
  });

  it("narrows to one level", () => {
    const { stdout } = run("--level", "3", "EC");
    expect(stdout.trim().split("\n")).toHaveLength(1);
    expect(stdout.startsWith("l3-clear-brief/ec-site\tL3\t")).toBe(true);
  });

  it("keeps only prompts containing every keyword", () => {
    expect(run("EC", "カート").stdout.split("\n").filter(Boolean).length).toBeGreaterThan(0);
    expect(run("EC", "存在しない語").status).toBe(1);
  });

  it("rejects a level that is not a number", () => {
    expect(run("--level", "x").status).toBe(1);
  });
});

describe("show", () => {
  it("prints the prompt file byte for byte", () => {
    const { status, stdout } = run("show", "l1-hands-off/ec-site");
    expect(status).toBe(0);
    expect(stdout).toBe(readFileSync(path.join(promptsRoot, "l1-hands-off/ec-site.txt"), "utf8"));
  });

  it("refuses an id that is not a prompt", () => {
    expect(run("show", "../../.claude-plugin/plugin.json").status).toBe(1);
  });
});
