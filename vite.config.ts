import { fileURLToPath } from "node:url";

import { markdownOf } from "@r_masseater/msch/lint";
import { defineConfig } from "vite-plus";

export default defineConfig({
  commitlint: { extends: [fileURLToPath(import.meta.resolve("@commitlint/config-conventional"))] },
  y8: markdownOf({
    docs: {
      agents: { skillNames: { index: "masseater-style" } },
      skills: { usecases: ["ユースケース"], skillNames: { index: "masseater-style" } },
    },
  }),
  test: {
    exclude: ["**/node_modules/**", "plugins/*/hooks/*.test.{ts,tsx}"],
  },
  run: {
    tasks: {
      msch: { command: "msch", cache: false },
      test: { command: "vp test run", dependsOn: ["msch"] },
    },
  },
});
