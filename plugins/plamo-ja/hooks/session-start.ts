import { field, readHookInput, writeHookOutput } from "./lib/hook-io.ts";
import { resolveDataDir, Store } from "./lib/store.ts";

/** 再開や compact の後も、英語で書く決まりを Claude が覚えているように渡す文言 */
const REMINDER =
  "Japanese display mode (plamo-ja) is on for this session. A hook translates your text into Japanese " +
  "for display only. Write all user-facing text in plain, complete English sentences and read the " +
  "user's Japanese directly. Run `/plamo-ja:display off` to turn it off.";

const input = readHookInput();
const store = new Store(resolveDataDir());
store.pruneMessages();
if (store.isOn(field(input, "session_id"))) {
  writeHookOutput({ hookEventName: "SessionStart", additionalContext: REMINDER });
}
