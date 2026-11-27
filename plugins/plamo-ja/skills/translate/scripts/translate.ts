import { readFileSync, writeFileSync } from "node:fs";
import { parseArgs } from "node:util";
import { loadConfig } from "../../../hooks/lib/config.ts";
import { renderLines, splitLines } from "../../../hooks/lib/render.ts";
import { ensureServer } from "../../../hooks/lib/server.ts";
import { emptyMessageState } from "../../../hooks/lib/schema.ts";
import { resolveDataDir } from "../../../hooks/lib/store.ts";
import { translateSources } from "../../../hooks/lib/translator.ts";

const SERVER_WAIT_MS = 60_000;

const DOCUMENT_CONTEXT =
  "A technical document written by a software developer. " +
  "Keep technical terms, file paths, commands, identifiers, URLs and inline code unchanged.";

const USAGE = "usage: translate.ts <input.md> [--out <output.md>] [--data <DIR>]";

async function translateUnits(sources: string[], config: ReturnType<typeof loadConfig>) {
  const failures: string[] = [];
  const translated = await translateSources(sources, [], config, (_error, en) => failures.push(en));
  return { results: sources.map((en, i) => translated[i] ?? en), failures };
}

async function main(args: string[]): Promise<number> {
  const parsed = parseArgs({
    args,
    allowPositionals: true,
    options: { out: { type: "string" }, data: { type: "string" } },
  });
  const input = parsed.positionals[0];
  if (!input) {
    console.error(USAGE);
    return 2;
  }
  const config = { ...loadConfig(resolveDataDir(parsed.values.data)), context: DOCUMENT_CONTEXT, form: loadConfig(resolveDataDir(parsed.values.data)).form ?? "plain" };
  if (!(await ensureServer(config.url, process.env.PLAMO_JA_SERVER_COMMAND, SERVER_WAIT_MS))) {
    console.error(`No PLaMo server answers at ${config.url}. Run \`plamo-ja.ts install\` first.`);
    return 1;
  }
  const failures: string[] = [];
  const japanese = await renderLines(
    splitLines(readFileSync(input, "utf8")),
    emptyMessageState(),
    async (sources) => {
      const done = await translateUnits(sources, config);
      failures.push(...done.failures);
      return done.results;
    },
  );
  if (parsed.values.out) writeFileSync(parsed.values.out, japanese);
  else process.stdout.write(japanese);
  for (const en of failures) console.error(`untranslated: ${en}`);
  return failures.length > 0 ? 3 : 0;
}

process.exitCode = await main(process.argv.slice(2));
