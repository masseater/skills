import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, it } from "vite-plus/test";
import { FALLOW_VERSION, fallowBin, isModelReady, runtimeRoot, takeLock } from "./runtime.ts";

describe("runtimeRoot", () => {
  it("follows XDG_CACHE_HOME", () => {
    expect(runtimeRoot({ XDG_CACHE_HOME: "/cache" })).toBe("/cache/cross-similar-code");
  });
});

describe("fallowBin", () => {
  it("sits under a directory named after the pinned version", () => {
    expect(fallowBin("/cache/x")).toBe(`/cache/x/fallow-${FALLOW_VERSION}/node_modules/.bin/fallow`);
  });
});

describe("isModelReady", () => {
  it("reads the Ready line of fallow similar-code status", () => {
    expect(isModelReady("Similar-code local provider\n  Ready: yes\n")).toBe(true);
    expect(isModelReady("Similar-code local provider\n  Ready: no\n")).toBe(false);
  });
});

describe("takeLock", () => {
  it("lets one installer run at a time and frees the lock when released", () => {
    const root = mkdtempSync(path.join(tmpdir(), "cross-similar-code-"));
    try {
      const release = takeLock(root);
      expect(release).toBeDefined();
      expect(takeLock(root)).toBeUndefined();
      release?.();
      expect(takeLock(root)).toBeDefined();
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
});
