import { spawnSync } from "node:child_process";
import path from "node:path";
import { expect, it } from "vite-plus/test";

const root = path.resolve(import.meta.dirname, "..");

it("keeps every plugin's dist/kit equal to the kit files its sources import", () => {
  const result = spawnSync(process.execPath, ["bin/build-kit.ts", "--check"], { cwd: root, encoding: "utf8" });
  expect(result.status, `${result.stdout}${result.stderr}`).toBe(0);
});
