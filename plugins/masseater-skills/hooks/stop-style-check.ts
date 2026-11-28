import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { decide } from "./lib/style-check.ts";

const git = (cwd: string, args: readonly string[]): string => {
  try {
    return execFileSync("git", args, { cwd, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
  } catch {
    return "";
  }
};

const input: unknown = JSON.parse(readFileSync(0, "utf8"));
const record = typeof input === "object" && input !== null ? (input as Record<string, unknown>) : {};
const cwd = typeof record.cwd === "string" ? record.cwd : process.cwd();

const remote = git(cwd, ["remote", "get-url", "origin"]);
const unmerged = git(cwd, ["rev-list", "--count", "origin/HEAD..HEAD"]);
const output = decide({
  stopHookActive: record.stop_hook_active === true,
  masseaterRepository: /[/:]masseater\//.test(remote),
  hasChanges: git(cwd, ["status", "--porcelain"]) !== "" || (unmerged !== "" && unmerged !== "0"),
});
if (output !== undefined) process.stdout.write(JSON.stringify(output));
