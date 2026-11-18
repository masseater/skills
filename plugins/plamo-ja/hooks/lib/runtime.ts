import { execFile, spawn } from "node:child_process";
import { createHash } from "node:crypto";
import { createReadStream, existsSync, mkdirSync, openSync, renameSync, rmSync } from "node:fs";
import { homedir } from "node:os";
import path from "node:path";
import { promisify } from "node:util";
import { MODEL_ALIAS } from "./plamo.ts";

const run = promisify(execFile);

const LLAMA_TAG = "b12228";
const LLAMA_RELEASES = `https://github.com/ggml-org/llama.cpp/releases/download/${LLAMA_TAG}`;
const MODEL_REVISION = "1cf96ae02133958a20074bfdfab76517bb737d00";
const MODEL_BASE = `https://huggingface.co/pfnet/plamo-3-translate-0.8b-GGUF/resolve/${MODEL_REVISION}`;
const MODEL_FILE = "plamo-3-translate-0.8b-Q4_K_M.gguf";
const TEMPLATE_FILE = "chat_template.jinja";
const CONTEXT_SIZE = "16384";

type Pinned = { name: string; sha256: string };

const SERVER_ARCHIVES: Record<string, Pinned> = {
  "linux-x64": {
    name: `llama-${LLAMA_TAG}-bin-ubuntu-x64.tar.gz`,
    sha256: "61672e52aefe54ef3f90babf6a9fa4489f019ae61a5bdcd55d91caa6dc6e1cee",
  },
  "darwin-arm64": {
    name: `llama-${LLAMA_TAG}-bin-macos-arm64.tar.gz`,
    sha256: "253fd52bd0127e1d6627c35aec75694a94c72e3ce552c016dbb3b54be9084b3c",
  },
};

const MODEL_FILES: Pinned[] = [
  { name: MODEL_FILE, sha256: "70891ec70dc7ab4205745a38307867c2881b99239f20327927633abfe4bc9ec6" },
  {
    name: TEMPLATE_FILE,
    sha256: "ad7eb87b161c6792be070d777a9f9da50c9e57a77e1fa5cca3a24b91b6bdb9e9",
  },
];

const LOCAL_HOSTS = new Set(["127.0.0.1", "localhost", "[::1]"]);

export type Runtime = { server: string; modelDir: string; root: string };

export function serverArchive(platform: string, arch: string): Pinned | undefined {
  return SERVER_ARCHIVES[`${platform}-${arch}`];
}

export function isLocalUrl(url: string): boolean {
  return LOCAL_HOSTS.has(new URL(url).hostname);
}

export function runtimeRoot(env: NodeJS.ProcessEnv = process.env): string {
  const cache = env.XDG_CACHE_HOME || path.join(homedir(), ".cache");
  return path.join(cache, "plamo-ja", "runtime");
}

export function serverArgs(port: string): string[] {
  return [
    "-m",
    MODEL_FILE,
    "-c",
    CONTEXT_SIZE,
    "--host",
    "127.0.0.1",
    "--port",
    port,
    "--alias",
    MODEL_ALIAS,
    "--chat-template-file",
    TEMPLATE_FILE,
    "--no-prefill-assistant",
    "--metrics",
  ];
}

async function sha256Of(file: string): Promise<string> {
  const hash = createHash("sha256");
  for await (const chunk of createReadStream(file)) hash.update(chunk);
  return hash.digest("hex");
}

async function fetchPinned(url: string, file: string, sha256: string): Promise<void> {
  if (existsSync(file) && (await sha256Of(file)) === sha256) return;
  const partial = `${file}.part`;
  await run("curl", [
    "--fail",
    "--silent",
    "--show-error",
    "--location",
    "--retry",
    "3",
    "--continue-at",
    "-",
    "--output",
    partial,
    url,
  ]);
  const actual = await sha256Of(partial);
  if (actual !== sha256) {
    rmSync(partial, { force: true });
    throw new Error(`plamo-ja: ${path.basename(file)} has sha256 ${actual}, expected ${sha256}`);
  }
  renameSync(partial, file);
}

async function installServer(root: string, archive: Pinned): Promise<string> {
  const dir = path.join(root, `llama-${LLAMA_TAG}`);
  const server = path.join(dir, "llama-server");
  if (existsSync(server)) return server;
  const file = path.join(root, archive.name);
  await fetchPinned(`${LLAMA_RELEASES}/${archive.name}`, file, archive.sha256);
  const staging = path.join(root, "staging");
  rmSync(staging, { recursive: true, force: true });
  mkdirSync(staging, { recursive: true });
  await run("tar", ["-xzf", file, "-C", staging]);
  renameSync(path.join(staging, `llama-${LLAMA_TAG}`), dir);
  rmSync(staging, { recursive: true, force: true });
  rmSync(file, { force: true });
  return server;
}

async function installModel(root: string): Promise<string> {
  const dir = path.join(root, `model-${MODEL_REVISION}`);
  mkdirSync(dir, { recursive: true });
  await Promise.all(
    MODEL_FILES.map((pinned) =>
      fetchPinned(`${MODEL_BASE}/${pinned.name}`, path.join(dir, pinned.name), pinned.sha256),
    ),
  );
  return dir;
}

export async function installRuntime(root: string = runtimeRoot()): Promise<Runtime | undefined> {
  const archive = serverArchive(process.platform, process.arch);
  if (!archive) return undefined;
  mkdirSync(root, { recursive: true });
  const [server, modelDir] = await Promise.all([installServer(root, archive), installModel(root)]);
  return { server, modelDir, root };
}

export function startRuntime(runtime: Runtime, port: string): void {
  const log = openSync(path.join(runtime.root, "server.log"), "a");
  spawn(runtime.server, serverArgs(port), {
    cwd: runtime.modelDir,
    detached: true,
    stdio: ["ignore", log, log],
  }).unref();
}
