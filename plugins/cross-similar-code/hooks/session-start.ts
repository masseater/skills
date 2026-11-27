import { spawn } from "node:child_process";
import { mkdirSync, openSync } from "node:fs";
import path from "node:path";
import { runtimeRoot } from "./lib/runtime.ts";

const root = runtimeRoot();
mkdirSync(root, { recursive: true });
const log = openSync(path.join(root, "install.log"), "a");
spawn(process.execPath, [path.join(import.meta.dirname, "install.ts")], {
  detached: true,
  stdio: ["ignore", log, log],
}).unref();
