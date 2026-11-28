export const GRAPH_PATH = "/mnt/project-files/status-view/graph.json";
export const DEFAULT_GOAL = "g-ops";
export const CHECKLIST_TOOL = "mcp__hearthbot__update_progress_checklist";
export const RESOLVE_TOOL = "mcp__hearthbot__set_thread_resolved";
export const REPORT_TOOL = "mcp__hearthbot__post_message";

const THREAD_ID = /cmsg_[A-Za-z0-9]+/;
const WAKE_THREAD = /thread ts=\\?"(cmsg_[A-Za-z0-9]+)/;
const REPORT_LINE_LIMIT = 160;

export type GraphThread = {
  readonly id: string;
  readonly title: string;
  readonly resolvedAt?: string;
};

export type GraphTask = {
  readonly id: string;
  readonly goal: string;
  readonly title: string;
  readonly status: string;
  readonly deps: readonly string[];
  readonly updatedAt: string;
  readonly now?: string;
  readonly ask?: string;
  readonly since?: string;
  readonly result?: string;
  readonly threads: readonly GraphThread[];
  readonly prs: readonly unknown[];
};

export type Graph = {
  readonly generatedAt: string;
  readonly goals: readonly { readonly id: string; readonly title: string }[];
  readonly tasks: readonly GraphTask[];
};

export type Checklist = { readonly title: string; readonly now: string | undefined };

export function parseChecklist(text: string): Checklist | undefined {
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line !== "");
  const title = lines[0];
  if (title === undefined) return undefined;
  const steps = lines.slice(1).map((line) => ({ mark: line.slice(0, 1), text: line.slice(1).trim() }));
  const current = steps.find((step) => step.mark === "✱") ?? steps.find((step) => step.mark === "○");
  return { title, now: current?.text };
}

export function threadIdFromResponse(response: unknown): string | undefined {
  return THREAD_ID.exec(JSON.stringify(response) ?? "")?.[0];
}

export function threadIdFromTranscript(head: string): string | undefined {
  return WAKE_THREAD.exec(head)?.[1];
}

export function lastReportLine(transcript: string): string | undefined {
  for (const raw of transcript.split("\n").reverse()) {
    if (!raw.includes(REPORT_TOOL)) continue;
    const text = reportText(raw);
    const line = text?.split("\n").find((candidate) => candidate.trim() !== "");
    if (line !== undefined) return line.trim().slice(0, REPORT_LINE_LIMIT);
  }
  return undefined;
}

function reportText(raw: string): string | undefined {
  try {
    const entry: unknown = JSON.parse(raw);
    const content = (entry as { message?: { content?: unknown } }).message?.content;
    if (!Array.isArray(content)) return undefined;
    for (const part of content.reverse() as readonly { type?: string; name?: string; input?: { text?: unknown } }[]) {
      if (part.type === "tool_use" && part.name === REPORT_TOOL && typeof part.input?.text === "string") return part.input.text;
    }
  } catch {
    return undefined;
  }
  return undefined;
}

function newTaskId(graph: Graph, threadId: string): string {
  const base = `t-${threadId.slice(-6).toLowerCase()}`;
  return graph.tasks.some((task) => task.id === base) ? `${base}-${graph.tasks.length}` : base;
}

function defaultGoal(graph: Graph): string {
  return graph.goals.some((goal) => goal.id === DEFAULT_GOAL) ? DEFAULT_GOAL : (graph.goals[0]?.id ?? DEFAULT_GOAL);
}

function withTask(graph: Graph, taskId: string, change: (task: GraphTask) => GraphTask): Graph {
  return { ...graph, tasks: graph.tasks.map((task) => (task.id === taskId ? change(task) : task)) };
}

function drop<T extends object, K extends keyof T>(value: T, ...keys: readonly K[]): Omit<T, K> {
  const copy = { ...value };
  for (const key of keys) delete copy[key];
  return copy;
}

export function applyChecklist(graph: Graph, input: { threadId: string; checklist: Checklist; at: string }): Graph {
  const { threadId, checklist, at } = input;
  const stamped = { ...graph, generatedAt: at };
  const task = graph.tasks.find((candidate) => candidate.threads.some((thread) => thread.id === threadId));
  if (task === undefined) {
    const created: GraphTask = {
      id: newTaskId(graph, threadId),
      goal: defaultGoal(graph),
      title: checklist.title,
      status: "run",
      deps: [],
      updatedAt: at,
      ...(checklist.now === undefined ? {} : { now: checklist.now }),
      threads: [{ id: threadId, title: checklist.title }],
      prs: [],
    };
    return { ...stamped, tasks: [...graph.tasks, created] };
  }
  if (task.status === "sched") return stamped;
  return withTask(stamped, task.id, (current) => {
    const threads = current.threads.map((thread) => (thread.id === threadId ? drop(thread, "resolvedAt") : thread));
    const reopened = ["done", "todo", "stall"].includes(current.status);
    const status = reopened ? "run" : current.status;
    const single = threads.length === 1 && status === "run" && checklist.now !== undefined;
    const now = single ? checklist.now : current.now;
    const changed = reopened || (single && now !== current.now);
    const base = reopened ? drop(current, "result", "ask", "since") : current;
    return {
      ...base,
      threads,
      status,
      ...(now === undefined ? {} : { now }),
      updatedAt: changed ? at : current.updatedAt,
    };
  });
}

export function isResolved(graph: Graph, threadId: string): boolean {
  const task = graph.tasks.find((candidate) => candidate.threads.some((thread) => thread.id === threadId));
  return task?.threads.find((thread) => thread.id === threadId)?.resolvedAt !== undefined;
}

export function applyResolved(graph: Graph, input: { threadId: string; result: string; at: string }): Graph | undefined {
  const { threadId, result, at } = input;
  const task = graph.tasks.find((candidate) => candidate.threads.some((thread) => thread.id === threadId));
  if (task === undefined || task.status === "sched" || isResolved(graph, threadId)) return undefined;
  return withTask({ ...graph, generatedAt: at }, task.id, (current) => {
    const threads = current.threads.map((thread) => (thread.id === threadId ? { ...thread, resolvedAt: at } : thread));
    const finished = threads.every((thread) => thread.resolvedAt !== undefined);
    if (!finished || current.status === "done") return { ...current, threads };
    return { ...drop(current, "now", "ask", "since"), threads, status: "done", result, updatedAt: at };
  });
}
