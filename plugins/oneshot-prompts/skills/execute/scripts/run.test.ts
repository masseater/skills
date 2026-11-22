import { spawnSync } from "node:child_process";
import { chmodSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vite-plus/test";

const script = path.join(import.meta.dirname, "run.ts");
const promptsRoot = path.resolve(import.meta.dirname, "../../../prompts");
let work: string;

beforeAll(() => {
  work = mkdtempSync(path.join(tmpdir(), "oneshot-run-"));
  const fake = path.join(work, "claude");
  writeFileSync(fake, `#!/bin/sh\necho "args: $*"\ncat\n`);
  chmodSync(fake, 0o755);
});

afterAll(() => {
  rmSync(work, { recursive: true, force: true });
});

function run(...args: string[]): { status: number | null; stdout: string; stderr: string } {
  const { status, stdout, stderr } = spawnSync(process.execPath, [script, ...args], {
    encoding: "utf8",
    env: { ...process.env, PATH: `${work}${path.delimiter}${process.env.PATH}` },
  });
  return { status, stdout, stderr };
}

describe("run", () => {
  it.each(["haiku", "sonnet", "opus", "fable"])("passes %s to claude -p and feeds the prompt on stdin", (model) => {
    const { status, stdout } = run("--model", model, "l1-hands-off/ec-site");
    expect(status).toBe(0);
    const body = readFileSync(path.join(promptsRoot, "l1-hands-off/ec-site.txt"), "utf8");
    expect(stdout).toBe(`args: -p --model ${model}\n${body}`);
  });

  it("refuses a model outside the four", () => {
    expect(run("--model", "gpt", "l1-hands-off/ec-site").status).toBe(2);
    expect(run("l1-hands-off/ec-site").status).toBe(2);
  });

  it("refuses an id that is not a prompt", () => {
    expect(run("--model", "haiku", "../../.claude-plugin/plugin.json").status).toBe(1);
  });
});
