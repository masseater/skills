import { parseArgs } from "node:util";
import { autoOn, type Config, loadConfig } from "../../../hooks/lib/config.ts";
import { isServerUp } from "../../../hooks/lib/plamo.ts";
import { installRuntime } from "../../../hooks/lib/runtime.ts";
import { ensureServer } from "../../../hooks/lib/server.ts";
import { resolveDataDir, Store } from "../../../hooks/lib/store.ts";

const SERVER_WAIT_MS = 60_000;

type Context = { store: Store; sessionId: string };

function configOf(store: Store): Config {
  return loadConfig(store.dataDir);
}

async function turnOn({ store, sessionId }: Context): Promise<void> {
  store.setOn(sessionId, true);
  const config = configOf(store);
  if (await ensureServer(config.url, process.env.PLAMO_JA_SERVER_COMMAND, SERVER_WAIT_MS)) {
    console.log(`Japanese display mode is on. PLaMo server: ${config.url}`);
    return;
  }
  console.log(
    `Japanese display mode is on, but no PLaMo server answers at ${config.url}. ` +
      "Text is shown in English until one starts. Run `plamo-ja.ts install` to see why the bundled " +
      "server could not start, or set PLAMO_JA_SERVER_COMMAND or PLAMO_JA_URL.",
  );
}

async function showStatus({ store, sessionId }: Context): Promise<void> {
  const config = configOf(store);
  const up = await isServerUp(config.url);
  const mode = store.isOn(sessionId, autoOn()) ? "on" : "off";
  console.log(`mode: ${mode}\nserver: ${config.url} (${up ? "up" : "down"})`);
}

const COMMANDS: Record<string, (context: Context) => void | Promise<void>> = {
  on: turnOn,
  off: ({ store, sessionId }) => {
    store.setOn(sessionId, false);
    console.log("Japanese display mode is off.");
  },
  reset: ({ store, sessionId }) => {
    store.clearHistory(sessionId);
    console.log("Translation history cleared.");
  },
  status: showStatus,
};

const USAGE = `usage: plamo-ja.ts <${Object.keys(COMMANDS).join("|")}> --session <ID> [--data <DIR>]\n       plamo-ja.ts install`;

async function install(): Promise<number> {
  const runtime = await installRuntime();
  if (!runtime) {
    console.error(`No llama-server build is pinned for ${process.platform}-${process.arch}.`);
    return 1;
  }
  console.log(`PLaMo runtime is ready in ${runtime.root}`);
  return 0;
}

async function main(args: string[]): Promise<number> {
  let parsed;
  try {
    parsed = parseArgs({
      args,
      allowPositionals: true,
      options: { session: { type: "string" }, data: { type: "string" } },
    });
  } catch (error) {
    console.error(`${String(error)}\n${USAGE}`);
    return 2;
  }
  const name = parsed.positionals[0] ?? "on";
  if (name === "install") return install();
  const command = COMMANDS[name];
  const sessionId = parsed.values.session;
  if (!command || !sessionId) {
    console.error(USAGE);
    return 2;
  }
  await command({ store: new Store(resolveDataDir(parsed.values.data)), sessionId });
  return 0;
}

process.exitCode = await main(process.argv.slice(2));
