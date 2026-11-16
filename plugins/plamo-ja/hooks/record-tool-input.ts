import { field, readHookInput } from "./lib/hook-io.ts";
import { autoOn } from "./lib/config.ts";
import { resolveDataDir, Store } from "./lib/store.ts";
import { fieldTexts, TRANSLATED_FIELDS } from "./lib/tool-input.ts";

const input = readHookInput();
const sessionId = field(input, "session_id");
const paths = TRANSLATED_FIELDS[field(input, "tool_name")];
const store = new Store(resolveDataDir());

if (
  paths &&
  store.isOn(sessionId, autoOn()) &&
  store.rewriteMode(sessionId) === "unknown" &&
  store.wasIssued(sessionId, fieldTexts(input.tool_input, paths))
) {
  store.setRewriteMode(sessionId, "ok");
}
