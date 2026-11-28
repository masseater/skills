import { markdownOf } from "@r_masseater/msch/lint";
import { defineConfig } from "vite-plus";

export default defineConfig({
  y8: markdownOf({ docs: { skills: { usecases: ["ユースケース"] } } }),
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
