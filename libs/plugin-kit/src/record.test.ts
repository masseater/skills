import { describe, expect, it } from "vite-plus/test";
import { isRecord, parseJson } from "./record.ts";

describe("isRecord", () => {
  it("accepts plain objects only", () => {
    expect(isRecord({ a: 1 })).toBe(true);
    expect(isRecord([])).toBe(false);
    expect(isRecord(null)).toBe(false);
    expect(isRecord("a")).toBe(false);
  });
});

describe("parseJson", () => {
  it("returns the value, or undefined when the text is not JSON", () => {
    expect(parseJson('{"a":1}')).toEqual({ a: 1 });
    expect(parseJson("{")).toBeUndefined();
  });
});
