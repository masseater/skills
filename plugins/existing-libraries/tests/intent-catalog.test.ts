import { mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vite-plus/test";
import { findRepositoryRoot, formatCatalog } from "../hooks/lib/intent-catalog.ts";

const dirs: string[] = [];
afterEach(() => {
  for (const dir of dirs.splice(0)) rmSync(dir, { recursive: true, force: true });
});

describe("findRepositoryRoot", () => {
  it("編集するファイルから上にたどり、.git のあるディレクトリを返す", () => {
    const root = mkdtempSync(path.join(tmpdir(), "existing-libraries-"));
    dirs.push(root);
    mkdirSync(path.join(root, ".git"));
    mkdirSync(path.join(root, "apps", "web", "src"), { recursive: true });
    expect(findRepositoryRoot(path.join(root, "apps", "web", "src", "new-file.ts"))).toBe(root);
  });
});

describe("formatCatalog", () => {
  it("skill ごとに読み込み方と説明を 1 行で並べ、隠れている数を添える", () => {
    const text = formatCatalog(
      {
        skills: [
          { use: "drizzle-kit#migrations", description: "Generate\n  migrations." },
          { use: "drizzle-kit#migrations", description: "Generate\n  migrations." },
        ],
        hiddenSourceCount: 2,
      },
      "/repo",
    );
    const lines = text?.split("\n") ?? [];
    expect(lines.filter((line) => line.startsWith("- "))).toEqual([
      "- `drizzle-kit#migrations`: Generate migrations.",
    ]);
    expect(lines.at(-1)).toContain("2 more installed packages");
  });

  it("skill も隠れたものも無ければ何も返さない", () => {
    expect(formatCatalog({ skills: [], hiddenSourceCount: 0 }, "/repo")).toBe(undefined);
  });
});
