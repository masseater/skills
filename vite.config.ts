import { defineConfig } from "vite-plus";

export default defineConfig({
  y8: {
    rules: {
      "markdownlint/MD013": "off",
      "markdownlint/MD034": "off",
      "markdownlint/MD060": "off",
      "markdownlint/MD024": ["error", { siblings_only: true }],
      "markdownlint/MD026": ["error", { punctuation: ".,;:。，；：" }],
    },
  },
  test: {
    exclude: ["**/node_modules/**", "plugins/*/hooks/*.test.{ts,tsx}"],
  },
  run: {
    tasks: {
      readme: { command: "node bin/update-readme.ts", cache: false },
      msch: { command: "msch", cache: false },
      test: { command: "vp test run", dependsOn: ["msch"] },
    },
  },
});
