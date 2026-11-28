import { spawn } from "node:child_process";
import { mkdirSync, openSync } from "node:fs";
import path from "node:path";
import { cacheRootOf } from "@r_masseater/plugin-kit";
import { CACHE_SEGMENTS } from "./lib/runtime.ts";

const root = await cacheRootOf(CACHE_SEGMENTS);
mkdirSync(root, { recursive: true });
const log = openSync(path.join(root, "install.log"), "a");
spawn(process.execPath, [path.join(import.meta.dirname, "install.ts")], {
  detached: true,
  stdio: ["ignore", log, log],
}).unref();
