import { field, readHookInput, writeHookOutput } from "./lib/hook-io.ts";
import { autoOn, loadConfig } from "./lib/config.ts";
import { renderLines, splitLines } from "./lib/render.ts";
import { resolveDataDir, Store } from "./lib/store.ts";
import { createBatchTranslator } from "./lib/translator.ts";

const input = readHookInput();
const sessionId = field(input, "session_id");
const store = new Store(resolveDataDir());

if (store.isOn(sessionId, autoOn())) {
  const messageId = field(input, "message_id");
  const key = String(input.index ?? 0);
  const state = store.readMessage(messageId);
  let shown = state.done[key];
  if (shown === undefined) {
    const config = loadConfig(store.dataDir);
    const translateBatch = createBatchTranslator(store, sessionId, config, (error) => {
      console.error(`plamo-ja: translation failed; showing the original text: ${String(error)}`);
    });
    shown = await renderLines(splitLines(field(input, "delta")), state, translateBatch);
    state.done[key] = shown;
    store.writeMessage(messageId, state);
  }
  writeHookOutput({ hookEventName: "MessageDisplay", displayContent: shown });
}
