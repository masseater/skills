import { spawnSync } from "node:child_process";
import { parseArgs } from "node:util";
import { loadPrompts } from "../../../lib/prompts.ts";

const MODELS = ["haiku", "sonnet", "opus", "fable"];
const USAGE = `usage: run.ts --model <${MODELS.join("|")}> <id>`;

const { values, positionals } = parseArgs({
  args: process.argv.slice(2),
  options: { model: { type: "string" } },
  allowPositionals: true,
});

const model = values.model ?? "";
if (!MODELS.includes(model) || positionals.length !== 1) {
  console.error(USAGE);
  process.exit(2);
}

const prompt = loadPrompts().find((candidate) => candidate.id === positionals[0]);
if (!prompt) {
  console.error(`no prompt with id ${positionals[0]}\n${USAGE}`);
  process.exit(1);
}

const result = spawnSync("claude", ["-p", "--model", model], {
  input: prompt.text,
  stdio: ["pipe", "inherit", "inherit"],
});
if (result.error) {
  console.error(`could not run claude: ${result.error.message}`);
  process.exit(1);
}
process.exit(result.status ?? 1);
