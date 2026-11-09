#!/usr/bin/env node
import { processIo, run } from "../lib/cli.ts";

process.exitCode = await run(process.argv.slice(2), processIo());
