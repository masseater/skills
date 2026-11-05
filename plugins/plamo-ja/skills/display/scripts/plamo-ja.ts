/**
 * 日本語表示モードの切り替えと、hook の訳し方での単発の翻訳
 *
 * 使い方: plamo-ja.ts <on|off|reset|status|translate> --session <ID> [--data <DIR>]
 * translate は標準入力の英文を訳して標準出力に書く。
 */
import { readFileSync } from "node:fs";
import { parseArgs } from "node:util";
import { type Config, DEFAULT_URL, loadConfig } from "../../../hooks/lib/config.ts";
import { isServerUp, MODEL_ALIAS } from "../../../hooks/lib/plamo.ts";
import { renderLines, splitLines } from "../../../hooks/lib/render.ts";
import { emptyMessageState } from "../../../hooks/lib/schema.ts";
import { resolveDataDir, Store } from "../../../hooks/lib/store.ts";
import { createBatchTranslator } from "../../../hooks/lib/translator.ts";

const SERVER_COMMAND = [
  "hf download pfnet/plamo-3-translate-0.8b-GGUF plamo-3-translate-0.8b-Q4_K_M.gguf chat_template.jinja --local-dir plamo-3-translate-0.8b-GGUF",
  `cd plamo-3-translate-0.8b-GGUF && llama-server -m plamo-3-translate-0.8b-Q4_K_M.gguf -c 16384 --port ${new URL(DEFAULT_URL).port} --alias ${MODEL_ALIAS} --chat-template-file chat_template.jinja --no-prefill-assistant`,
].join("\n");

type Context = { store: Store; sessionId: string };

/** glossary.json が壊れていても off と reset は動くよう、設定は使うコマンドだけが読む */
function configOf(store: Store): Config {
  return loadConfig(store.dataDir);
}

async function turnOn({ store, sessionId }: Context): Promise<void> {
  store.setOn(sessionId, true);
  const config = configOf(store);
  if (await isServerUp(config.url)) {
    console.log(`Japanese display mode is on. PLaMo server: ${config.url}`);
    return;
  }
  const portNote = config.url === DEFAULT_URL ? "" : "\n(Adjust --port to match PLAMO_JA_URL.)";
  console.log(
    `Japanese display mode is on, but no PLaMo server answers at ${config.url}. ` +
      `Text is shown in English until it starts. Start it with:\n${SERVER_COMMAND}${portNote}`,
  );
}

async function showStatus({ store, sessionId }: Context): Promise<void> {
  const config = configOf(store);
  const up = await isServerUp(config.url);
  const mode = store.isOn(sessionId) ? "on" : "off";
  console.log(`mode: ${mode}\nserver: ${config.url} (${up ? "up" : "down"})`);
}

async function translateStdin({ store, sessionId }: Context): Promise<void> {
  const input = readFileSync(0, "utf8");
  const translateBatch = createBatchTranslator(store, sessionId, configOf(store), (error) => {
    console.error(`plamo-ja: ${String(error)}`);
  });
  const shown = await renderLines(splitLines(input), emptyMessageState(), translateBatch);
  process.stdout.write(shown);
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
  translate: translateStdin,
};

const USAGE = `usage: plamo-ja.ts <${Object.keys(COMMANDS).join("|")}> --session <ID> [--data <DIR>]`;

async function main(args: string[]): Promise<number> {
  let parsed;
  try {
    parsed = parseArgs({
      args,
      allowPositionals: true,
      options: { session: { type: "string" }, data: { type: "string" } },
    });
  } catch (error) {
    // 知らないオプションや値の無い --session は使い方の誤りなので、使い方を出して終える
    console.error(`${String(error)}\n${USAGE}`);
    return 2;
  }
  const command = COMMANDS[parsed.positionals[0] ?? "on"];
  const sessionId = parsed.values.session;
  if (!command || !sessionId) {
    console.error(USAGE);
    return 2;
  }
  await command({ store: new Store(resolveDataDir(parsed.values.data)), sessionId });
  return 0;
}

process.exitCode = await main(process.argv.slice(2));
