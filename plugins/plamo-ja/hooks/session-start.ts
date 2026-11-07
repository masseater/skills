import { field, readHookInput, writeHookOutput } from "./lib/hook-io.ts";
import { autoOn, loadConfig } from "./lib/config.ts";
import { ensureServer } from "./lib/server.ts";
import { resolveDataDir, Store } from "./lib/store.ts";
import { TRANSLATED_FIELDS } from "./lib/tool-input.ts";

const REMINDER =
  "Japanese display mode (plamo-ja) is on for this session. Write every message to the user in plain, " +
  "complete English sentences, one sentence or list item per line, with code, paths and identifiers in " +
  "backticks. Hooks translate it into Japanese with a local model before the user sees it: your " +
  `terminal text and these tool inputs: ${Object.keys(TRANSLATED_FIELDS).join(", ")}. ` +
  "Everything else keeps its usual language: files, code comments, commit messages, PR titles and " +
  "bodies, and tool inputs not listed here (for example decision cards and thread titles), which are " +
  "not translated. Read the user's Japanese directly. `/plamo-ja:display off` turns this off.";

const SERVER_DOWN =
  "Japanese display mode (plamo-ja) is on, but its PLaMo server is not running, so nothing is " +
  "translated. Write in the user's language as usual.";

const SERVER_WAIT_MS = 60_000;

const input = readHookInput();
const store = new Store(resolveDataDir());
store.pruneMessages();
if (store.isOn(field(input, "session_id"), autoOn())) {
  const { url } = loadConfig(store.dataDir);
  const up = await ensureServer(url, process.env.PLAMO_JA_SERVER_COMMAND, SERVER_WAIT_MS);
  writeHookOutput({
    hookEventName: "SessionStart",
    additionalContext: up ? REMINDER : SERVER_DOWN,
  });
}
