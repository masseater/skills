import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { field, readHookInput, record, writeHookOutput } from "./lib/hook-io.ts";
import { findRepositoryRoot, formatCatalog, INTENT_BIN } from "./lib/intent-catalog.ts";

const input = readHookInput();
const toolInput = record(input, "tool_input");
const target = field(toolInput, "file_path") || field(toolInput, "notebook_path");
const root = target ? findRepositoryRoot(path.resolve(field(input, "cwd"), target)) : undefined;
const projectDir = process.env.CLAUDE_PROJECT_DIR;
const intent = root ? path.join(root, INTENT_BIN) : "";

if (root && root !== (projectDir && path.resolve(projectDir)) && existsSync(intent)) {
  const marker = path.join(
    tmpdir(),
    "existing-libraries",
    createHash("sha256")
      .update(`${field(input, "session_id")}\0${root}`)
      .digest("hex"),
  );
  if (!existsSync(marker)) {
    mkdirSync(path.dirname(marker), { recursive: true });
    writeFileSync(marker, "");
    const list: unknown = JSON.parse(
      execFileSync(intent, ["list", "--json", "--no-notices"], {
        cwd: root,
        encoding: "utf8",
        stdio: ["ignore", "pipe", "ignore"],
        timeout: 15_000,
      }),
    );
    const reason = formatCatalog(list, root);
    if (reason) {
      writeHookOutput({
        hookEventName: "PreToolUse",
        permissionDecision: "deny",
        permissionDecisionReason: reason,
      });
    }
  }
}
