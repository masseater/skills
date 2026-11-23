import { field, readHookInput, writeHookOutput } from "./lib/hook-io.ts";
import { autoOn, loadConfig } from "./lib/config.ts";
import { renderLines, splitLines, translatableUnits } from "./lib/render.ts";
import { emptyMessageState } from "./lib/schema.ts";
import { ensureServer } from "./lib/server.ts";
import { resolveDataDir, Store } from "./lib/store.ts";
import { fieldTexts, TRANSLATED_FIELDS, translateToolInput } from "./lib/tool-input.ts";
import { createBatchTranslator } from "./lib/translator.ts";

const SERVER_WAIT_MS = 30_000;

const RESEND =
  "call the same tool again with exactly this input. plamo-ja lets an input it translated " +
  "through unchanged, so the second call goes through.";

const PROMPTLESS_TOOLS = new Set(["AskUserQuestion"]);

function deny(reason: string): void {
  writeHookOutput({
    hookEventName: "PreToolUse",
    permissionDecision: "deny",
    permissionDecisionReason: reason,
  });
}

const input = readHookInput();
const sessionId = field(input, "session_id");
const toolName = field(input, "tool_name");
const paths = TRANSLATED_FIELDS[toolName];
const store = new Store(resolveDataDir());

async function main(): Promise<void> {
  if (!paths || !store.isOn(sessionId, autoOn())) return;
  const texts = fieldTexts(input.tool_input, paths);
  if (store.wasIssued(sessionId, texts)) {
    if (store.rewriteMode(sessionId) === "unknown") store.setRewriteMode(sessionId, "refused");
    return;
  }
  if (!texts.some((text) => translatableUnits(text).length > 0)) return;

  const config = loadConfig(store.dataDir);
  if (!(await ensureServer(config.url, process.env.PLAMO_JA_SERVER_COMMAND, SERVER_WAIT_MS))) {
    deny(
      "plamo-ja could not reach its PLaMo server, so it cannot translate this call. " +
        "Write the user-facing text of this call in Japanese yourself and call the tool again.",
    );
    return;
  }

  const failed: string[] = [];
  const translateBatch = createBatchTranslator(store, sessionId, config, (error, en) => {
    failed.push(en);
    console.error(`plamo-ja: translation failed: ${String(error)}`);
  });
  const { value, changed } = await translateToolInput(input.tool_input, paths, (text) =>
    renderLines(splitLines(text), emptyMessageState(), translateBatch),
  );
  const json = JSON.stringify(value);

  if (failed.length > 0) {
    deny(
      "plamo-ja could not translate these lines into Japanese:\n" +
        failed.map((en) => `- ${en}`).join("\n") +
        "\nCall the same tool again with the input below, after rewriting only those lines " +
        `in Japanese yourself:\n${json}`,
    );
    return;
  }
  if (!changed) return;

  store.markIssued(sessionId, fieldTexts(value, paths));
  const mode = store.rewriteMode(sessionId);
  if (mode === "refused") {
    deny(
      "plamo-ja translated the user-facing text into Japanese. Hooks cannot change this " +
        `call's input in this environment, so ${RESEND}\n${json}`,
    );
    return;
  }
  writeHookOutput({
    hookEventName: "PreToolUse",
    ...(PROMPTLESS_TOOLS.has(toolName) && {
      permissionDecision: "allow",
      permissionDecisionReason: "plamo-ja translated the user-facing text into Japanese",
    }),
    updatedInput: value,
    ...(mode === "unknown" && {
      additionalContext:
        "plamo-ja replaced the user-facing text of this call with a Japanese translation. " +
        "If the call ran, do not send it again. If it was refused because a hook changed its " +
        `input, ${RESEND}\n${json}`,
    }),
  });
}

await main();
