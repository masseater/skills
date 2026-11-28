import { appendFileSync, closeSync, existsSync, mkdirSync, openSync, readFileSync, readSync, renameSync, rmSync, statSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import {
  applyChecklist,
  applyResolved,
  CHECKLIST_TOOL,
  GRAPH_PATH,
  isResolved,
  lastReportLine,
  parseChecklist,
  RESOLVE_TOOL,
  threadIdFromTranscript,
  type Graph,
} from "./lib/task-graph.ts";

const TRANSCRIPT_HEAD_BYTES = 262_144;
const LOCK_WAIT_MS = 3_000;
const LOCK_STALE_MS = 10_000;
const VERIFY_AFTER_MS = 10_000;

const record = (value: unknown): Record<string, unknown> =>
  typeof value === "object" && value !== null ? (value as Record<string, unknown>) : {};

const sleep = (ms: number): void => {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
};

const readHead = (path: string): string => {
  const fd = openSync(path, "r");
  try {
    const buffer = Buffer.alloc(TRANSCRIPT_HEAD_BYTES);
    return buffer.toString("utf8", 0, readSync(fd, buffer, 0, TRANSCRIPT_HEAD_BYTES, 0));
  } finally {
    closeSync(fd);
  }
};

const withLock = (path: string, run: () => void): boolean => {
  const lock = `${path}.lock`;
  const deadline = Date.now() + LOCK_WAIT_MS;
  for (;;) {
    try {
      mkdirSync(lock);
      break;
    } catch {
      if (existsSync(lock) && Date.now() - statSync(lock).mtimeMs > LOCK_STALE_MS) rmSync(lock, { recursive: true, force: true });
      else if (Date.now() > deadline) return false;
      else sleep(50);
    }
  }
  try {
    run();
    return true;
  } finally {
    rmSync(lock, { recursive: true, force: true });
  }
};

const input = record(JSON.parse(readFileSync(0, "utf8")));
const path = process.env.TASK_GRAPH_PATH ?? GRAPH_PATH;
const transcriptPath = typeof input.transcript_path === "string" && existsSync(input.transcript_path) ? input.transcript_path : undefined;
const toolInput = record(input.tool_input);
const timestamp = (): string => new Date().toISOString().replace(/\.\d+Z$/, "Z");

if (existsSync(path)) {
  const threadId = transcriptPath === undefined ? undefined : threadIdFromTranscript(readHead(transcriptPath));
  const log = (outcome: string): void => {
    try {
      const directory = join(dirname(path), "hook-log");
      mkdirSync(directory, { recursive: true });
      appendFileSync(join(directory, `${threadId ?? "unknown"}.log`), `${timestamp()} ${String(input.hook_event_name)} ${String(input.tool_name)} ${outcome}\n`);
    } catch {
      return;
    }
  };
  const update = (change: (graph: Graph, id: string) => Graph | undefined): boolean => {
    if (threadId === undefined) return false;
    return withLock(path, () => {
      const next = change(JSON.parse(readFileSync(path, "utf8")) as Graph, threadId);
      if (next === undefined) return;
      writeFileSync(`${path}.tmp`, JSON.stringify(next));
      renameSync(`${path}.tmp`, path);
    });
  };

  if (input.tool_name === CHECKLIST_TOOL && typeof toolInput.text === "string") {
    const checklist = parseChecklist(toolInput.text);
    if (checklist !== undefined) log(update((graph, id) => applyChecklist(graph, { threadId: id, checklist, at: timestamp() })) ? "checklist written" : "checklist skipped");
  } else if (input.tool_name === RESOLVE_TOOL && toolInput.resolved === true && threadId !== undefined) {
    const report = transcriptPath === undefined ? undefined : lastReportLine(readFileSync(transcriptPath, "utf8"));
    const resolve = (graph: Graph, id: string): Graph | undefined => {
      const title = graph.tasks.find((task) => task.threads.some((thread) => thread.id === id))?.title ?? "";
      return applyResolved(graph, { threadId: id, result: report ?? `${title}を終えた。`, at: timestamp() });
    };
    log(update(resolve) ? "resolve written" : "resolve skipped");
    sleep(VERIFY_AFTER_MS);
    const lost = !isResolved(JSON.parse(readFileSync(path, "utf8")) as Graph, threadId);
    if (lost) log(update(resolve) ? "resolve written again after it was overwritten" : "resolve skipped again");
  }
}
