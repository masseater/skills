import { describe, expect, it } from "vite-plus/test";
import { formatOwnPackages } from "../hooks/lib/own-packages.ts";

describe("formatOwnPackages", () => {
  it("新しく出したものから順に名前と説明を並べる", () => {
    const text = formatOwnPackages({
      objects: [
        { package: { name: "old", description: "Old one.", date: "2026-04-06T09:06:45.037Z" } },
        { package: { name: "new", description: "New one.", date: "2026-11-06T08:08:04.211Z" } },
      ],
    });
    expect(text?.split("\n").slice(-2)).toEqual([
      "- `new` (2026-11-06): New one.",
      "- `old` (2026-04-06): Old one.",
    ]);
  });

  it("形の違う要素は飛ばし、何も残らなければ何も返さない", () => {
    expect(formatOwnPackages({ objects: [{ package: { description: "no name" } }, null] })).toBe(
      undefined,
    );
    expect(formatOwnPackages({ error: "boom" })).toBe(undefined);
  });
});
