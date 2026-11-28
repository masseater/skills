import { describe, expect, it } from "vite-plus/test";
import { isLocalUrl, serverArchive, serverArgs } from "./runtime.ts";

describe("serverArchive", () => {
  it("pins a llama.cpp build for Linux x64 and macOS arm64", () => {
    expect(serverArchive("linux", "x64")?.name).toMatch(/ubuntu-x64\.tar\.gz$/);
    expect(serverArchive("darwin", "arm64")?.name).toMatch(/macos-arm64\.tar\.gz$/);
  });

  it("has no build for other platforms", () => {
    expect(serverArchive("win32", "x64")).toBeUndefined();
    expect(serverArchive("linux", "arm64")).toBeUndefined();
  });
});

describe("isLocalUrl", () => {
  it("starts a server only for this machine", () => {
    expect(isLocalUrl("http://127.0.0.1:8000")).toBe(true);
    expect(isLocalUrl("http://localhost:8000")).toBe(true);
    expect(isLocalUrl("http://[::1]:8000")).toBe(true);
    expect(isLocalUrl("http://translate.example.com")).toBe(false);
  });
});

describe("serverArgs", () => {
  it("binds to loopback on the configured port", () => {
    const args = serverArgs("8123");
    expect(args[args.indexOf("--host") + 1]).toBe("127.0.0.1");
    expect(args[args.indexOf("--port") + 1]).toBe("8123");
  });

  it("exposes llama.cpp's Prometheus metrics so that translation time can be read", () => {
    expect(serverArgs("8123")).toContain("--metrics");
  });
});
