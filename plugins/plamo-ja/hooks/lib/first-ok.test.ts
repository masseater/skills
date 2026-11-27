import { describe, expect, it } from "vite-plus/test";
import { firstOk } from "./first-ok.ts";

describe("firstOk", () => {
  it("returns the first success and skips the rest", async () => {
    const calls: number[] = [];
    const outcome = await firstOk([
      async () => {
        calls.push(1);
        throw new Error("one");
      },
      async () => {
        calls.push(2);
        return "two";
      },
      async () => {
        calls.push(3);
        return "three";
      },
    ]);
    expect(outcome).toEqual({ ok: true, value: "two" });
    expect(calls).toEqual([1, 2]);
  });

  it("returns the last error when every try fails", async () => {
    const outcome = await firstOk([
      async () => {
        throw new Error("one");
      },
      async () => {
        throw new Error("two");
      },
    ]);
    expect(outcome).toEqual({ ok: false, error: new Error("two") });
  });

  it("fails with no tries", async () => {
    expect((await firstOk([])).ok).toBe(false);
  });
});
