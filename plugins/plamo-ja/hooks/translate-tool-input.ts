import { field, readHookInput, writeHookOutput } from "./lib/hook-io.ts";
import { autoOn, loadConfig } from "./lib/config.ts";
import { renderLines, splitLines } from "./lib/render.ts";
import { emptyMessageState } from "./lib/schema.ts";
import { resolveDataDir, Store } from "./lib/store.ts";
import { TRANSLATED_FIELDS, translateToolInput } from "./lib/tool-input.ts";
import { createBatchTranslator } from "./lib/translator.ts";

const input = readHookInput();
const sessionId = field(input, "session_id");
const paths = TRANSLATED_FIELDS[field(input, "tool_name")];
const store = new Store(resolveDataDir());

if (paths && store.isOn(sessionId, autoOn())) {
  const translateBatch = createBatchTranslator(
    store,
    sessionId,
    loadConfig(store.dataDir),
    (error) => {
      // 訳せなかった単位は英文のまま送られる。原因は claude --debug で読める
      console.error(`plamo-ja: translation failed; sending the original text: ${String(error)}`);
    },
  );
  const { value, changed } = await translateToolInput(input.tool_input, paths, (text) =>
    renderLines(splitLines(text), emptyMessageState(), translateBatch),
  );
  if (changed) {
    // 入力を書き換えた呼び出しは、決定が無いと auto mode に拒まれうる。AskUserQuestion も allow を要る
    writeHookOutput({
      hookEventName: "PreToolUse",
      permissionDecision: "allow",
      permissionDecisionReason: "plamo-ja translated the user-facing text into Japanese",
      updatedInput: value,
    });
  }
}
