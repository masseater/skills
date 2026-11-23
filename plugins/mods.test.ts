import { spawnSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vite-plus/test";

const root = path.resolve(import.meta.dirname, "..");
const claudeBin = path.join(root, "node_modules/.bin/claude");
const mods = readdirSync(import.meta.dirname, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .filter((name) => {
    const hooks = path.join(import.meta.dirname, name, "hooks/hooks.json");
    return existsSync(hooks) && "modules" in JSON.parse(readFileSync(hooks, "utf8"));
  });

function claude(args: string[]): { status: number | null; output: string } {
  const result = spawnSync(claudeBin, args, { encoding: "utf8", cwd: root });
  return { status: result.status, output: `${result.stdout}${result.stderr}` };
}

describe("mods", () => {
  it("finds the mods", () => {
    expect(mods).toContain("cogload");
  });

  it.each(mods)("%s validates", (mod) => {
    const validated = claude(["plugin", "validate", path.join("plugins", mod)]);
    expect(validated.status, validated.output).toBe(0);
  });

  it.each(mods)("%s passes its own tests", (mod) => {
    const tested = claude(["plugin", "test", path.join("plugins", mod)]);
    expect(tested.status, tested.output).toBe(0);
  });
});
