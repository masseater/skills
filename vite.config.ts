import "@r_masseater/y8/vite";
import { markdownStyle } from "@r_masseater/y8-presets";
import { defineConfig } from "vite-plus";

export default defineConfig({
  y8: { extends: [markdownStyle()] },
  run: {
    tasks: {
      readme: { command: "node bin/update-readme.ts", cache: false },
      msch: { command: "msch", cache: false },
      test: { command: "vp test run", dependsOn: ["msch"] },
    },
  },
});
