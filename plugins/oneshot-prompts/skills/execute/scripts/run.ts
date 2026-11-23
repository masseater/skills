import { spawnSync } from "node:child_process";
import { parseArgs } from "node:util";
import { loadPrompts } from "../../../lib/prompts.ts";

const MODELS = ["haiku", "sonnet", "opus", "fable", "mythos"];
const MODEL_IDS: Record<string, string> = { mythos: "claude-mythos-5-2" };
const EFFORTS = ["low", "medium", "high", "xhigh", "max"];
const PERMISSION_MODES = ["default", "acceptEdits", "plan", "auto", "dontAsk", "bypassPermissions"];
const ISOLATE_ARGS = ["--tools", "Bash,Write,Edit,Read", "--strict-mcp-config", "--disable-slash-commands", "--setting-sources", "project"];
const USAGE = `usage: run.ts --model <${MODELS.join("|")}> [--effort <${EFFORTS.join("|")}>] [--permission-mode <${PERMISSION_MODES.join("|")}>] <id>`;

const { values, positionals } = parseArgs({
  args: process.argv.slice(2),
  options: { model: { type: "string" }, effort: { type: "string" }, "permission-mode": { type: "string" } },
  allowPositionals: true,
});

const model = values.model ?? "";
const effort = values.effort;
const permissionMode = values["permission-mode"];
if (!MODELS.includes(model) || (effort !== undefined && !EFFORTS.includes(effort)) ||
  (permissionMode !== undefined && !PERMISSION_MODES.includes(permissionMode)) || positionals.length !== 1) {
  console.error(USAGE);
  process.exit(2);
}

const prompt = loadPrompts().find((candidate) => candidate.id === positionals[0]);
if (!prompt) {
  console.error(`no prompt with id ${positionals[0]}\n${USAGE}`);
  process.exit(1);
}

const result = spawnSync("claude", ["-p", "--model", MODEL_IDS[model] ?? model, ...(effort ? ["--effort", effort] : []), ...(permissionMode ? ["--permission-mode", permissionMode] : []), ...ISOLATE_ARGS], {
  input: prompt.text,
  stdio: ["pipe", "inherit", "inherit"],
});
if (result.error) {
  console.error(`could not run claude: ${result.error.message}`);
  process.exit(1);
}
process.exit(result.status ?? 1);
