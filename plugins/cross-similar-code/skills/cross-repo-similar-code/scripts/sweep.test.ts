import { describe, expect, it } from "vite-plus/test";
import { crossRepo, plan, readCompletion, split, sourceFiles, type Pair, type Unit } from "./sweep.ts";

const unit = (repo: string, files: string[], dir = "", shallow = false): Unit => ({ repo, dir, shallow, files });
const side = (path: string, line = 1) => ({ path, name: "f", startLine: line, endLine: line + 3 });
const pair = (left: string, right: string, similarity = 0.9): Pair => ({ similarity, left: side(left), right: side(right) });

describe("sourceFiles", () => {
  it("keeps tracked script sources and drops everything else", () => {
    expect(sourceFiles("a.ts\0README.md\0b/c.tsx\0d.json\0")).toEqual(["a.ts", "b/c.tsx"]);
  });
});

describe("split", () => {
  it("divides a unit by its next directory level and keeps loose files as a shallow unit", () => {
    const parts = split(unit("r", ["a.ts", "libs/x/b.ts", "libs/y/c.ts", "apps/z/d.ts"]));
    expect(parts.map((p) => [p.dir, p.shallow, p.files])).toEqual([
      ["libs", false, ["libs/x/b.ts", "libs/y/c.ts"]],
      ["apps", false, ["apps/z/d.ts"]],
      ["", true, ["a.ts"]],
    ]);
  });

  it("splits a nested unit one level further", () => {
    const [first] = split(unit("r", ["libs/x/b.ts", "libs/y/c.ts"], "libs"));
    expect(first?.dir).toBe("libs/x");
  });
});

describe("readCompletion", () => {
  const report = (extracted: number, embedding: string, comparison: string) => ({
    completion: {
      limits: { max_functions: 10000 },
      phases: [
        { phase: "extraction", status: "partial", processed: extracted },
        { phase: "embedding", status: embedding },
        { phase: "comparison", status: comparison },
      ],
    },
  });

  it("does not treat unsupported function forms in extraction as a failure", () => {
    expect(readCompletion(report(2399, "complete", "complete"))).toEqual({
      capped: false,
      embedded: true,
      compared: true,
      reasons: [],
    });
  });

  it("flags a root that reached the function limit, and unfinished phases", () => {
    const done = readCompletion(report(10000, "partial", "complete"));
    expect(done.capped).toBe(true);
    expect(done.reasons).toEqual(["embedding partial"]);
  });

  it("reports a missing report as unfinished", () => {
    expect(readCompletion(undefined).embedded).toBe(false);
  });
});

describe("crossRepo", () => {
  it("keeps pairs across repositories once, whichever side they are seen from", () => {
    const pairs = [pair("a/x.ts", "b/y.ts"), pair("b/y.ts", "a/x.ts"), pair("a/x.ts", "a/z.ts")];
    expect(crossRepo(pairs)).toHaveLength(1);
  });
});

describe("plan", () => {
  const a = unit("a", ["x/1.ts", "y/2.ts", "3.ts"]);
  const b = unit("b", ["q/1.ts"]);
  const c = unit("c", ["r/1.ts"]);

  it("uses one root when nothing is capped", () => {
    expect(plan([a, b, c], () => false)).toEqual({ roots: [[a, b, c]], unresolved: [] });
  });

  it("falls back to repository pairs when the whole set is capped", () => {
    const result = plan([a, b, c], (units) => units.length > 2);
    expect(result.roots.map((root) => root.map((u) => u.repo))).toEqual([
      ["a", "b"],
      ["a", "c"],
      ["b", "c"],
    ]);
  });

  it("splits the larger side of a capped pair and reports what cannot be split", () => {
    const result = plan([a, b], (units) => units.some((u) => u.files.length > 1));
    expect(result.unresolved).toEqual([]);
    expect(result.roots.every((root) => root.every((u) => u.files.length === 1))).toBe(true);
    const stuck = plan([unit("a", ["1.ts", "2.ts"]), b], () => true);
    expect(stuck.roots).toEqual([]);
    expect(stuck.unresolved).toHaveLength(1);
  });
});
