import { closeSync, existsSync, openSync, readFileSync, readSync, renameSync, rmSync, statSync, writeFileSync, mkdirSync } from "node:fs";
import {
  applyChecklist,
  applyResolved,
  CHECKLIST_TOOL,
  GRAPH_PATH,
  lastReportLine,
  parseChecklist,
  RESOLVE_TOOL,
  threadIdFromResponse,
  threadIdFromTranscript,
  type Graph,
} from "./lib/task-graph.ts";

const TRANSCRIPT_HEAD_BYTES = 262_144;
const LOCK_WAIT_MS = 3_000;
const LOCK_STALE_MS = 10_000;

const record = (value: unknown): Record<string, unknown> =>
  typeof value === "object" && value !== null ? (value as Record<string, unknown>) : {};

const readHead = (path: string): string => {
  const fd = openSync(path, "r");
  try {
    const buffer = Buffer.alloc(TRANSCRIPT_HEAD_BYTES);
    return buffer.toString("utf8", 0, readSync(fd, buffer, 0, TRANSCRIPT_HEAD_BYTES, 0));
  } finally {
    closeSync(fd);
  }
};

const withLock = (path: string, run: () => void): void => {
  const lock = `${path}.lock`;
  const deadline = Date.now() + LOCK_WAIT_MS;
  for (;;) {
    try {
      mkdirSync(lock);
      break;
    } catch {
      if (existsSync(lock) && Date.now() - statSync(lock).mtimeMs > LOCK_STALE_MS) rmSync(lock, { recursive: true, force: true });
      else if (Date.now() > deadline) return;
      else Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 50);
    }
  }
  try {
    run();
  } finally {
    rmSync(lock, { recursive: true, force: true });
  }
};

const input = record(JSON.parse(readFileSync(0, "utf8")));
const path = process.env.TASK_GRAPH_PATH ?? GRAPH_PATH;
const transcriptPath = typeof input.transcript_path === "string" && existsSync(input.transcript_path) ? input.transcript_path : undefined;
const toolInput = record(input.tool_input);

if (existsSync(path)) {
  const at = new Date().toISOString().replace(/\.\d+Z$/, "Z");
  const threadId =
    (input.tool_name === RESOLVE_TOOL ? threadIdFromResponse(input.tool_response) : undefined) ??
    (transcriptPath === undefined ? undefined : threadIdFromTranscript(readHead(transcriptPath)));
  const write = (change: (graph: Graph, threadId: string) => Graph | undefined): void =>
    withLock(path, () => {
      if (threadId === undefined) return;
      const next = change(JSON.parse(readFileSync(path, "utf8")) as Graph, threadId);
      if (next === undefined) return;
      writeFileSync(`${path}.tmp`, JSON.stringify(next));
      renameSync(`${path}.tmp`, path);
    });

  if (input.tool_name === CHECKLIST_TOOL && typeof toolInput.text === "string") {
    const checklist = parseChecklist(toolInput.text);
    if (checklist !== undefined) write((graph, id) => applyChecklist(graph, { threadId: id, checklist, at }));
  } else if (input.tool_name === RESOLVE_TOOL && toolInput.resolved === true) {
    const report = transcriptPath === undefined ? undefined : lastReportLine(readFileSync(transcriptPath, "utf8"));
    write((graph, id) => {
      const title = graph.tasks.find((task) => task.threads.some((thread) => thread.id === id))?.title ?? "";
      return applyResolved(graph, { threadId: id, result: report ?? `${title}を終えた。`, at });
    });
  }
}
