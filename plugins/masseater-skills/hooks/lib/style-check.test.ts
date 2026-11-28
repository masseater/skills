import { describe, expect, it } from "vite-plus/test";
import { decide, REASON } from "./style-check.ts";

const base = { stopHookActive: false, masseaterRepository: true, hasChanges: true };

describe("decide", () => {
  it("blocks the first stop of a masseater repository with changes", () => {
    expect(decide(base)).toEqual({ decision: "block", reason: REASON });
  });

  it("lets the stop after the reminder through", () => {
    expect(decide({ ...base, stopHookActive: true })).toBeUndefined();
  });

  it("stays out of other repositories", () => {
    expect(decide({ ...base, masseaterRepository: false })).toBeUndefined();
  });

  it("stays out of a turn that changed nothing", () => {
    expect(decide({ ...base, hasChanges: false })).toBeUndefined();
  });
});
