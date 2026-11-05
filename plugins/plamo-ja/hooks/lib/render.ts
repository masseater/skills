import type { MessageState } from "./schema.ts";

/** 訳す本文の並びを受け取り、同じ順の表示する文字列の並びを返す */
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

/** インラインコードの外の英字の数 */
function countLatin(text: string): number {
  return count(stripInlineCode(text), LATIN);
}

/**
 * 訳す価値のある英文かを判定する
 *
 * インラインコードを除いて英字が無いもの（記号やコードだけの行）と、
 * すでに日本語が主になっているものは訳さない。
 *
 * @param text - 判定する文
 * @returns 訳すなら true
 */
function needsTranslation(text: string): boolean {
  const latin = countLatin(text);
  return latin > 0 && count(stripInlineCode(text), JAPANESE) * 3 <= latin;
}

/**
 * 訳文が壊れていないかを判定する
 *
 * 長い英文の訳に日本語がほとんど無いときと、訳が原文より極端に長いときは失敗とみなす。
 *
 * @param en - 原文
 * @param ja - 訳文
 * @returns 壊れていれば true
 */
export function looksBroken(en: string, ja: string): boolean {
  const latin = countLatin(en);
  const japanese = count(ja, JAPANESE);
  if (latin >= 40 && japanese < 5) return true;
  return ja.length > en.length * 3 + 200;
}

/** 表示の 1 片。`text` はそのまま出し、`unit` は訳した本文を記号の後ろに置く */
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

/** 行を 1 つずつ受け取り、表示の片に分ける */
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

/**
 * ストリームで届いた行のまとまりを、そのまま出す片と訳す片に分ける
 *
 * コードフェンスの中、表の行、区切り線、空行はそのまま出す。見出し・箇条書き・引用は
 * 記号を残して本文だけを訳し、続く行は同じ単位として 1 行にまとめる。
 * フェンスが開いているかはバッチをまたいで `state.fence` に持ち越す。
 *
 * @param lines - 改行を含む行の並び（最後の行だけは改行が無いことがある）
 * @param state - このメッセージの状態。この関数が書き換える
 * @returns 表示の片の並び
 */
function segmentLines(lines: string[], state: MessageState): Segment[] {
  const segmenter = new Segmenter(state);
  for (const raw of lines) segmenter.push(raw);
  segmenter.flush();
  return segmenter.out;
}

/**
 * 行のまとまりを訳し、表示する文字列にする
 *
 * @param lines - 改行を含む行の並び
 * @param state - このメッセージの状態。この関数が書き換える
 * @param translateBatch - 訳す本文の並びを、同じ順の訳の並びにする
 * @returns 表示する文字列
 */
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

/**
 * テキストを改行つきの行に分ける。末尾の改行の無い行も 1 行として残す
 *
 * @param text - 分けるテキスト
 * @returns 改行を含む行の並び
 */
export function splitLines(text: string): string[] {
  return text.match(/[^\n]*\n|[^\n]+$/g) ?? [];
}
