import { gzipSync } from "node:zlib";
import { committedOffset, uploadChunk } from "./api.ts";
import type { Api } from "./api.ts";
import type { Detector } from "./betterleaks.ts";
import { maskText } from "./mask.ts";
import type { OffsetStore } from "./state.ts";
import { MAX_CHUNK_BYTES, readChunk } from "./transcript.ts";

export type PushTarget = {
  kind: string;
  session: string;
  file: string;
  path: string;
  cwd: string;
  source: string;
  remoteSession: string;
};

export type PushDeps = { api: Api; detect: Detector; offsets: OffsetStore; maxChunkBytes?: number };

export type PushResult = { chunks: number; bytes: number; redactions: number; committed: number };

const MAX_CONFLICTS = 3;

export async function pushFile(target: PushTarget, deps: PushDeps): Promise<PushResult> {
  const key = { kind: target.kind, session: target.session, file: target.file };
  let offset = deps.offsets.get(key) ?? (await committedOffset(deps.api, key));
  const result: PushResult = { chunks: 0, bytes: 0, redactions: 0, committed: offset };
  let conflicts = 0;
  for (;;) {
    const chunk = readChunk(target.path, offset, deps.maxChunkBytes ?? MAX_CHUNK_BYTES);
    if (chunk === undefined) break;
    const masked = maskText(chunk.text, deps.detect);
    const uploaded = await uploadChunk(
      deps.api,
      {
        ...key,
        start: chunk.start,
        end: chunk.end,
        redactions: masked.redactions,
        cwd: target.cwd,
        source: target.source,
        remoteSession: target.remoteSession,
      },
      gzipSync(Buffer.from(masked.text, "utf8")),
    );
    if (uploaded.status === "conflict") {
      conflicts += 1;
      if (conflicts > MAX_CONFLICTS) throw new Error(`offset kept conflicting for ${target.file}`);
      offset = uploaded.expected;
      deps.offsets.set(key, offset);
      continue;
    }
    offset = uploaded.committed;
    deps.offsets.set(key, offset);
    result.chunks += 1;
    result.bytes += chunk.end - chunk.start;
    result.redactions += masked.redactions;
  }
  result.committed = offset;
  return result;
}
