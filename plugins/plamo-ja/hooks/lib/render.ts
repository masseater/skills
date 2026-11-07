import type { MessageState } from "./schema.ts";

export type TranslateBatch = (sources: string[]) => Promise<string[]>;

const FENCE = /^ {0,3}(`{3,}|~{3,})/;
const BLOCK_PREFIX = /^(\s*(?:[-*+]|\d+[.)])\s+(?:\[[ xX]\]\s+)?|\s{0,3}#{1,6}\s+|\s*>\s?)/;
const TABLE_ROW = /^\s*\|/;
const THEMATIC_BREAK = /^\s{0,3}([-*_])(\s*\1){2,}\s*$/;
const JAPANESE = /[぀-ヿ㐀-鿿ｦ-ﾟ]/g;
const LATIN = /[A-Za-z]/g;

function count(text: string, re: RegExp): number {
  return text.match(re)?.length ?? 0;
}

function stripInlineCode(text: string): string {
  return text.replace(/`[^`]*`/g, "");
}

function countLatin(text: string): number {
  return count(stripInlineCode(text), LATIN);
}

function needsTranslation(text: string): boolean {
  const latin = countLatin(text);
  return latin > 0 && count(stripInlineCode(text), JAPANESE) * 3 <= latin;
}

export function looksBroken(en: string, ja: string): boolean {
  const latin = countLatin(en);
  const japanese = count(ja, JAPANESE);
  if (latin >= 40 && japanese < 5) return true;
  return ja.length > en.length * 3 + 200;
}

type Segment =
  | { kind: "text"; text: string }
  | { kind: "unit"; prefix: string; en: string; newline: boolean };

type OpenUnit = { prefix: string; parts: string[]; newline: boolean };

function closesFence(line: string, fence: string): boolean {
  const closing = line.trim();
  return (
    /^(`{3,}|~{3,})$/.test(closing) && closing[0] === fence[0] && closing.length >= fence.length
  );
}

function isVerbatim(line: string): boolean {
  return line.trim() === "" || TABLE_ROW.test(line) || THEMATIC_BREAK.test(line);
}

class Segmenter {
  readonly out: Segment[] = [];
  private unit: OpenUnit | null = null;

  private readonly state: MessageState;

  constructor(state: MessageState) {
    this.state = state;
  }

  push(raw: string): void {
    const newline = raw.endsWith("\n");
    const line = newline ? raw.slice(0, -1) : raw;
    if (this.state.fence) {
      this.out.push({ kind: "text", text: raw });
      if (closesFence(line, this.state.fence)) this.state.fence = null;
      return;
    }
    const fence = FENCE.exec(line)?.[1];
    if (fence) {
      this.verbatim(raw);
      this.state.fence = fence;
      return;
    }
    if (isVerbatim(line)) {
      this.verbatim(raw);
      return;
    }
    this.prose(line, newline);
  }

  flush(): void {
    const unit = this.unit;
    if (!unit) return;
    this.unit = null;
    const en = unit.parts.join(" ");
    this.out.push(
      needsTranslation(en)
        ? { kind: "unit", prefix: unit.prefix, en, newline: unit.newline }
        : { kind: "text", text: unit.prefix + en + (unit.newline ? "\n" : "") },
    );
  }

  private verbatim(raw: string): void {
    this.flush();
    this.out.push({ kind: "text", text: raw });
  }

  private prose(line: string, newline: boolean): void {
    const prefix = BLOCK_PREFIX.exec(line)?.[1];
    if (prefix !== undefined) {
      this.flush();
      this.unit = { prefix, parts: [line.slice(prefix.length).trim()], newline };
    } else if (this.unit) {
      this.unit.parts.push(line.trim());
      this.unit.newline = newline;
    } else {
      this.unit = { prefix: /^\s*/.exec(line)?.[0] ?? "", parts: [line.trim()], newline };
    }
  }
}

function segmentLines(lines: string[], state: MessageState): Segment[] {
  const segmenter = new Segmenter(state);
  for (const raw of lines) segmenter.push(raw);
  segmenter.flush();
  return segmenter.out;
}

export async function renderLines(
  lines: string[],
  state: MessageState,
  translateBatch: TranslateBatch,
): Promise<string> {
  const segments = segmentLines(lines, state);
  const sources = segments.flatMap((segment) => (segment.kind === "unit" ? [segment.en] : []));
  const translations = sources.length > 0 ? await translateBatch(sources) : [];
  let next = 0;
  return segments
    .map((segment) => {
      if (segment.kind === "text") return segment.text;
      const shown = translations[next++] ?? segment.en;
      return segment.prefix + shown + (segment.newline ? "\n" : "");
    })
    .join("");
}

export function splitLines(text: string): string[] {
  return text.match(/[^\n]*\n|[^\n]+$/g) ?? [];
}
