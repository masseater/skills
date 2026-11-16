import { defineConfig } from "vite-plus";

export default defineConfig({
  run: {
    tasks: {
      readme: { command: "node bin/update-readme.ts", cache: false },
      msch: { command: "msch", cache: false },
      test: { command: "vp test run", dependsOn: ["msch"] },
    },
  },
});
