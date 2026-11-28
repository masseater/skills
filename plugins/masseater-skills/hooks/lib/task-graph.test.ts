import { describe, expect, it } from "vite-plus/test";
import {
  applyChecklist,
  applyResolved,
  lastReportLine,
  parseChecklist,
  threadIdFromResponse,
  threadIdFromTranscript,
  type Graph,
} from "./task-graph.ts";

const AT = "2026-11-28T13:00:00Z";
const THREAD = "cmsg_AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAbc12Xy";

const graph = (tasks: Graph["tasks"] = []): Graph => ({
  generatedAt: "2026-11-28T11:00:00Z",
  goals: [
    { id: "g-msch", title: "msch" },
    { id: "g-ops", title: "運用" },
  ],
  tasks,
});

const task = (overrides: Partial<Graph["tasks"][number]> = {}): Graph["tasks"][number] => ({
  id: "t-one",
  goal: "g-ops",
  title: "一つ目",
  status: "run",
  deps: [],
  updatedAt: "2026-11-28T10:00:00Z",
  now: "前の作業",
  threads: [{ id: THREAD, title: "一つ目" }],
  prs: [],
  ...overrides,
});

describe("parseChecklist", () => {
  it("takes the header as the title and the first in-progress step as now", () => {
    expect(parseChecklist("見出し\n\n✓ 済んだ\n✱ 今やる\n○ 次")).toEqual({ title: "見出し", now: "今やる" });
  });

  it("falls back to the first step not started", () => {
    expect(parseChecklist("見出し\n✓ 済んだ\n○ 次")).toEqual({ title: "見出し", now: "次" });
  });

  it("has no now when every step is done", () => {
    expect(parseChecklist("見出し\n✓ 済んだ")).toEqual({ title: "見出し", now: undefined });
  });
});

describe("thread id", () => {
  it("reads it from a tool response", () => {
    expect(threadIdFromResponse([{ type: "text", text: `{"thread_id":"${THREAD}","resolved":true}` }])).toBe(THREAD);
  });

  it("reads it from the wake at the top of a transcript, escaped or not", () => {
    expect(threadIdFromTranscript(`{"content":"<thread ts=\\"${THREAD}\\">"}`)).toBe(THREAD);
    expect(threadIdFromTranscript(`<thread ts="${THREAD}">`)).toBe(THREAD);
  });
});

describe("applyChecklist", () => {
  const checklist = { title: "新しい作業", now: "調べる" };

  it("creates a run task for a thread no task holds", () => {
    const next = applyChecklist(graph(), { threadId: THREAD, checklist, at: AT });
    expect(next.generatedAt).toBe(AT);
    expect(next.tasks).toEqual([
      {
        id: "t-bc12xy",
        goal: "g-ops",
        title: "新しい作業",
        status: "run",
        deps: [],
        updatedAt: AT,
        now: "調べる",
        threads: [{ id: THREAD, title: "新しい作業" }],
        prs: [],
      },
    ]);
  });

  it("refreshes now of a run task that has one thread", () => {
    const next = applyChecklist(graph([task()]), { threadId: THREAD, checklist, at: AT });
    expect(next.tasks[0]).toMatchObject({ now: "調べる", updatedAt: AT, status: "run" });
  });

  it("keeps updatedAt when nothing changed", () => {
    const next = applyChecklist(graph([task({ now: "調べる" })]), { threadId: THREAD, checklist, at: AT });
    expect(next.tasks[0]?.updatedAt).toBe("2026-11-28T10:00:00Z");
  });

  it("keeps now of a task shared by several threads", () => {
    const shared = task({ threads: [{ id: THREAD, title: "a" }, { id: "cmsg_other", title: "b" }] });
    const next = applyChecklist(graph([shared]), { threadId: THREAD, checklist, at: AT });
    expect(next.tasks[0]?.now).toBe("前の作業");
  });

  it("reopens a done task and clears its result and the resolved mark", () => {
    const done = task({ status: "done", result: "終わった", threads: [{ id: THREAD, title: "a", resolvedAt: "2026-11-28T12:00:00Z" }] });
    const next = applyChecklist(graph([done]), { threadId: THREAD, checklist, at: AT });
    expect(next.tasks[0]).toMatchObject({ status: "run", now: "調べる", threads: [{ id: THREAD, title: "a" }] });
    expect(next.tasks[0]).not.toHaveProperty("result");
  });

  it("leaves a waiting-on-the-owner task as it is", () => {
    const asking = task({ status: "you", ask: "答える" });
    const next = applyChecklist(graph([asking]), { threadId: THREAD, checklist, at: AT });
    expect(next.tasks[0]).toMatchObject({ status: "you", ask: "答える", now: "前の作業" });
  });

  it("leaves a recurring task as it is", () => {
    const next = applyChecklist(graph([task({ status: "sched" })]), { threadId: THREAD, checklist, at: AT });
    expect(next.tasks[0]).toMatchObject({ status: "sched", now: "前の作業" });
  });

  it("falls back to the first goal when the default one is missing", () => {
    const next = applyChecklist({ ...graph(), goals: [{ id: "g-msch", title: "msch" }] }, { threadId: THREAD, checklist, at: AT });
    expect(next.tasks[0]?.goal).toBe("g-msch");
  });
});

describe("applyResolved", () => {
  it("closes a task whose threads are all resolved", () => {
    const next = applyResolved(graph([task({ ask: "x" })]), { threadId: THREAD, result: "できた", at: AT });
    expect(next?.tasks[0]).toMatchObject({ status: "done", result: "できた", updatedAt: AT, threads: [{ id: THREAD, resolvedAt: AT }] });
    expect(next?.tasks[0]).not.toHaveProperty("now");
    expect(next?.tasks[0]).not.toHaveProperty("ask");
  });

  it("keeps a task open while another thread of it is unresolved", () => {
    const shared = task({ threads: [{ id: THREAD, title: "a" }, { id: "cmsg_other", title: "b" }] });
    const next = applyResolved(graph([shared]), { threadId: THREAD, result: "できた", at: AT });
    expect(next?.tasks[0]).toMatchObject({ status: "run", now: "前の作業" });
    expect(next?.tasks[0]?.threads[0]).toMatchObject({ resolvedAt: AT });
  });

  it("closes the task when the last open thread resolves", () => {
    const shared = task({ threads: [{ id: THREAD, title: "a" }, { id: "cmsg_other", title: "b", resolvedAt: "2026-11-28T09:00:00Z" }] });
    expect(applyResolved(graph([shared]), { threadId: THREAD, result: "できた", at: AT })?.tasks[0]?.status).toBe("done");
  });

  it("does nothing for a thread no task holds or a recurring task", () => {
    expect(applyResolved(graph(), { threadId: THREAD, result: "x", at: AT })).toBeUndefined();
    expect(applyResolved(graph([task({ status: "sched" })]), { threadId: THREAD, result: "x", at: AT })).toBeUndefined();
  });
});

describe("lastReportLine", () => {
  const entry = (text: string): string =>
    JSON.stringify({ message: { content: [{ type: "tool_use", name: "mcp__hearthbot__post_message", input: { text } }] } });

  it("takes the first line of the last report", () => {
    const transcript = [entry("古い報告"), JSON.stringify({ message: { content: [] } }), entry("\n結果の一行\n詳細")].join("\n");
    expect(lastReportLine(transcript)).toBe("結果の一行");
  });

  it("has nothing when no report was posted", () => {
    expect(lastReportLine(JSON.stringify({ message: { content: [] } }))).toBeUndefined();
  });
});
