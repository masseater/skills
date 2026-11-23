import { spawnSync } from "node:child_process";
import { chmodSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vite-plus/test";

const isolation = "--tools Bash,Write,Edit,Read --strict-mcp-config --disable-slash-commands --setting-sources project";
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
  it.each([
    ["haiku", "haiku"],
    ["sonnet", "sonnet"],
    ["opus", "opus"],
    ["fable", "fable"],
    ["mythos", "claude-mythos-5-2"],
  ])("passes %s as %s to claude -p and feeds the prompt on stdin", (model, id) => {
    const { status, stdout } = run("--model", model, "l1-hands-off/ec-site");
    expect(status).toBe(0);
    const body = readFileSync(path.join(promptsRoot, "l1-hands-off/ec-site.txt"), "utf8");
    expect(stdout).toBe(`args: -p --model ${id} ${isolation}\n${body}`);
  });

  it("passes --effort to claude -p when given", () => {
    const { status, stdout } = run("--model", "haiku", "--effort", "medium", "l1-hands-off/ec-site");
    expect(status).toBe(0);
    expect(stdout.split("\n")[0]).toBe(`args: -p --model haiku --effort medium ${isolation}`);
  });

  it("passes --permission-mode to claude -p when given", () => {
    const { status, stdout } = run("--model", "haiku", "--permission-mode", "bypassPermissions", "l1-hands-off/ec-site");
    expect(status).toBe(0);
    expect(stdout.split("\n")[0]).toBe(`args: -p --model haiku --permission-mode bypassPermissions ${isolation}`);
  });

  it("refuses a permission mode outside the allowed ones", () => {
    expect(run("--model", "haiku", "--permission-mode", "yolo", "l1-hands-off/ec-site").status).toBe(2);
  });

  it("refuses an effort outside the allowed levels", () => {
    expect(run("--model", "haiku", "--effort", "turbo", "l1-hands-off/ec-site").status).toBe(2);
  });

  it("refuses a model outside the five", () => {
    expect(run("--model", "gpt", "l1-hands-off/ec-site").status).toBe(2);
    expect(run("l1-hands-off/ec-site").status).toBe(2);
  });

  it("refuses an id that is not a prompt", () => {
    expect(run("--model", "haiku", "../../.claude-plugin/plugin.json").status).toBe(1);
  });
});
