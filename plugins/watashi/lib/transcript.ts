import { closeSync, existsSync, fstatSync, openSync, readSync, readdirSync } from "node:fs";
import path from "node:path";

export const MAX_CHUNK_BYTES = 2 * 1024 * 1024;

const NEWLINE = 0x0a;

export type Chunk = { start: number; end: number; text: string };

export type TranscriptFile = { file: string; path: string };

export function readChunk(filePath: string, start: number, maxBytes = MAX_CHUNK_BYTES): Chunk | undefined {
  const fd = openSync(filePath, "r");
  try {
    const size = fstatSync(fd).size;
    if (size <= start) return undefined;
    const length = Math.min(size - start, maxBytes);
    const buffer = Buffer.alloc(length);
    const read = readSync(fd, buffer, 0, length, start);
    const view = buffer.subarray(0, read);
    const lastNewline = view.lastIndexOf(NEWLINE);
    if (lastNewline >= 0) {
      const end = start + lastNewline + 1;
      return { start, end, text: view.subarray(0, lastNewline + 1).toString("utf8") };
    }
    if (read < maxBytes) return undefined;
    return readLongLine(fd, size, start);
  } finally {
    closeSync(fd);
  }
}

function readLongLine(fd: number, size: number, start: number): Chunk | undefined {
  const parts: Buffer[] = [];
  let position = start;
  const block = Buffer.alloc(MAX_CHUNK_BYTES);
  while (position < size) {
    const read = readSync(fd, block, 0, block.length, position);
    if (read === 0) break;
    const view = block.subarray(0, read);
    const newline = view.indexOf(NEWLINE);
    if (newline >= 0) {
      parts.push(Buffer.from(view.subarray(0, newline + 1)));
      const end = position + newline + 1;
      return { start, end, text: Buffer.concat(parts).toString("utf8") };
    }
    parts.push(Buffer.from(view));
    position += read;
  }
  return undefined;
}

export function transcriptFiles(transcriptPath: string, sessionId: string): TranscriptFile[] {
  const files: TranscriptFile[] = [{ file: sessionId, path: transcriptPath }];
  const subagents = path.join(path.dirname(transcriptPath), sessionId, "subagents");
  if (!existsSync(subagents)) return files;
  for (const name of readdirSync(subagents).sort()) {
    if (name.endsWith(".jsonl")) {
      files.push({ file: `subagents/${name.slice(0, -".jsonl".length)}`, path: path.join(subagents, name) });
    }
  }
  return files;
}
