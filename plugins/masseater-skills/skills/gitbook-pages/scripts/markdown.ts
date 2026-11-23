export type CalloutKind = "note" | "tip" | "important" | "warning" | "caution";
export type Align = "left" | "center" | "right" | null;

export type Block =
  | { type: "heading"; level: number; text: string }
  | { type: "paragraph"; text: string }
  | { type: "code"; lang: string; text: string }
  | { type: "list"; ordered: boolean; start: number; items: Block[][] }
  | { type: "quote"; children: Block[] }
  | { type: "callout"; kind: CalloutKind; children: Block[] }
  | { type: "table"; align: Align[]; head: string[]; rows: string[][] }
  | { type: "hr" };

const FENCE = /^(\s*)(`{3,}|~{3,})\s*([^\s`]*)/;
const HEADING = /^(#{1,6})\s+(.*?)\s*#*\s*$/;
const HR = /^\s*([-*_])(\s*\1){2,}\s*$/;
const QUOTE = /^\s*>\s?/;
const ITEM = /^(\s*)([-*+]|\d+[.)])\s+(.*)$/;
const TABLE_RULE = /^\s*\|?\s*:?-+:?\s*(\|\s*:?-+:?\s*)*\|?\s*$/;
const ALERT = /^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*$/i;

function indentOf(line: string): number {
  return line.length - line.trimStart().length;
}

function isBlank(line: string): boolean {
  return line.trim() === "";
}

function splitRow(line: string): string[] {
  const trimmed = line.trim().replace(/^\|/, "").replace(/(?<!\\)\|$/, "");
  return trimmed.split(/(?<!\\)\|/).map((cell) => cell.trim().replaceAll("\\|", "|"));
}

function alignOf(cell: string): Align {
  const left = cell.startsWith(":");
  const right = cell.endsWith(":");
  if (left && right) return "center";
  if (right) return "right";
  if (left) return "left";
  return null;
}

function startsBlock(lines: string[], i: number): boolean {
  const line = lines[i] ?? "";
  return (
    FENCE.test(line) ||
    HEADING.test(line) ||
    HR.test(line) ||
    QUOTE.test(line) ||
    ITEM.test(line) ||
    (line.includes("|") && TABLE_RULE.test(lines[i + 1] ?? ""))
  );
}

export function joinLines(lines: string[]): string {
  return lines.reduce((joined, line) => {
    const next = line.trim();
    if (joined === "") return next;
    if (/ {2}$|\\$/.test(joined)) return `${joined.replace(/ {2}$|\\$/, "")}\n${next}`;
    const tight = /[^\x00-\x7f]$/.test(joined) && /^[^\x00-\x7f]/.test(next);
    return tight ? `${joined}${next}` : `${joined} ${next}`;
  }, "");
}

function parseList(lines: string[], from: number): { block: Block; next: number } {
  const first = ITEM.exec(lines[from] ?? "");
  if (first === null) throw new Error(`not a list item: ${lines[from]}`);
  const base = first[1]?.length ?? 0;
  const ordered = /\d/.test(first[2] ?? "");
  const start = ordered ? Number.parseInt(first[2] ?? "1", 10) : 1;
  const items: string[][] = [];
  let i = from;
  while (i < lines.length) {
    const line = lines[i] ?? "";
    const match = ITEM.exec(line);
    if (match !== null && (match[1]?.length ?? 0) === base && /\d/.test(match[2] ?? "") === ordered) {
      const width = line.length - (match[3]?.length ?? 0);
      items.push([" ".repeat(width) + (match[3] ?? "")]);
      i += 1;
      continue;
    }
    if (isBlank(line)) {
      const following = lines.slice(i + 1).find((rest) => !isBlank(rest));
      if (following === undefined) break;
      const sibling = ITEM.exec(following);
      const continues =
        indentOf(following) > base ||
        (sibling !== null && indentOf(following) === base && /\d/.test(sibling[2] ?? "") === ordered);
      if (!continues) break;
      items.at(-1)?.push("");
      i += 1;
      continue;
    }
    if (indentOf(line) > base) {
      items.at(-1)?.push(line);
      i += 1;
      continue;
    }
    if (match === null && !startsBlock(lines, i) && !isBlank(lines[i - 1] ?? "")) {
      items.at(-1)?.push(line);
      i += 1;
      continue;
    }
    break;
  }
  const parsed = items.map((item) => {
    const cut = Math.min(...item.filter((line) => !isBlank(line)).map(indentOf));
    return parseBlocks(item.map((line) => line.slice(Math.min(cut, indentOf(line)))));
  });
  return { block: { type: "list", ordered, start, items: parsed }, next: i };
}

export function parseBlocks(lines: string[]): Block[] {
  const blocks: Block[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i] ?? "";
    if (isBlank(line)) {
      i += 1;
      continue;
    }
    const fence = FENCE.exec(line);
    if (fence !== null) {
      const marker = fence[2] ?? "```";
      const pad = fence[1]?.length ?? 0;
      const body: string[] = [];
      i += 1;
      while (i < lines.length && !(lines[i] ?? "").trim().startsWith(marker)) {
        body.push((lines[i] ?? "").slice(Math.min(pad, indentOf(lines[i] ?? ""))));
        i += 1;
      }
      blocks.push({ type: "code", lang: fence[3] ?? "", text: body.join("\n") });
      i += 1;
      continue;
    }
    const heading = HEADING.exec(line);
    if (heading !== null) {
      blocks.push({ type: "heading", level: heading[1]?.length ?? 1, text: heading[2] ?? "" });
      i += 1;
      continue;
    }
    if (HR.test(line) && !ITEM.test(line)) {
      blocks.push({ type: "hr" });
      i += 1;
      continue;
    }
    if (QUOTE.test(line)) {
      const body: string[] = [];
      while (i < lines.length && QUOTE.test(lines[i] ?? "")) {
        body.push((lines[i] ?? "").replace(QUOTE, ""));
        i += 1;
      }
      const alert = ALERT.exec(body[0]?.trim() ?? "");
      if (alert !== null) {
        const kind = (alert[1] ?? "note").toLowerCase() as CalloutKind;
        blocks.push({ type: "callout", kind, children: parseBlocks(body.slice(1)) });
      } else {
        blocks.push({ type: "quote", children: parseBlocks(body) });
      }
      continue;
    }
    if (ITEM.test(line)) {
      const { block, next } = parseList(lines, i);
      blocks.push(block);
      i = next;
      continue;
    }
    if (line.includes("|") && TABLE_RULE.test(lines[i + 1] ?? "")) {
      const head = splitRow(line);
      const align = splitRow(lines[i + 1] ?? "").map(alignOf);
      const rows: string[][] = [];
      i += 2;
      while (i < lines.length && !isBlank(lines[i] ?? "") && (lines[i] ?? "").includes("|")) {
        rows.push(splitRow(lines[i] ?? ""));
        i += 1;
      }
      blocks.push({ type: "table", align, head, rows });
      continue;
    }
    const body: string[] = [line];
    i += 1;
    while (i < lines.length && !isBlank(lines[i] ?? "") && !startsBlock(lines, i)) {
      body.push(lines[i] ?? "");
      i += 1;
    }
    blocks.push({ type: "paragraph", text: joinLines(body) });
  }
  return blocks;
}

export function parseMarkdown(source: string): Block[] {
  return parseBlocks(source.replaceAll("\r\n", "\n").replaceAll("\t", "    ").split("\n"));
}

export type Inline =
  | { type: "text"; text: string }
  | { type: "code"; text: string }
  | { type: "strong"; children: Inline[] }
  | { type: "em"; children: Inline[] }
  | { type: "del"; children: Inline[] }
  | { type: "link"; href: string; children: Inline[] }
  | { type: "image"; src: string; alt: string }
  | { type: "break" };

const INLINE_RULES: { pattern: RegExp; make: (match: RegExpExecArray) => Inline }[] = [
  { pattern: /\\([\\`*_{}[\]()#+\-.!|~<>])/, make: (m) => ({ type: "text", text: m[1] ?? "" }) },
  { pattern: /(`+)([\s\S]+?)\1/, make: (m) => ({ type: "code", text: (m[2] ?? "").trim() }) },
  { pattern: /!\[([^\]]*)\]\(([^)\s]+)\)/, make: (m) => ({ type: "image", alt: m[1] ?? "", src: m[2] ?? "" }) },
  {
    pattern: /\[((?:[^[\]]|\[[^\]]*\])+)\]\(([^)\s]+)\)/,
    make: (m) => ({ type: "link", href: m[2] ?? "", children: parseInline(m[1] ?? "") }),
  },
  { pattern: /<(https?:\/\/[^>\s]+)>/, make: (m) => ({ type: "link", href: m[1] ?? "", children: [{ type: "text", text: m[1] ?? "" }] }) },
  { pattern: /\*\*([\s\S]+?)\*\*/, make: (m) => ({ type: "strong", children: parseInline(m[1] ?? "") }) },
  { pattern: /~~([\s\S]+?)~~/, make: (m) => ({ type: "del", children: parseInline(m[1] ?? "") }) },
  { pattern: /\*([^*\s][^*]*?)\*/, make: (m) => ({ type: "em", children: parseInline(m[1] ?? "") }) },
  { pattern: /(?<![\p{L}\p{N}])_([^_\s][^_]*?)_(?![\p{L}\p{N}])/u, make: (m) => ({ type: "em", children: parseInline(m[1] ?? "") }) },
  { pattern: /\n/, make: () => ({ type: "break" }) },
];

export function parseInline(text: string): Inline[] {
  const out: Inline[] = [];
  let rest = text;
  while (rest !== "") {
    let best: { index: number; match: RegExpExecArray; make: (match: RegExpExecArray) => Inline } | undefined;
    for (const rule of INLINE_RULES) {
      const match = rule.pattern.exec(rest);
      if (match !== null && (best === undefined || match.index < best.index)) {
        best = { index: match.index, match, make: rule.make };
      }
    }
    if (best === undefined) {
      out.push({ type: "text", text: rest });
      break;
    }
    if (best.index > 0) out.push({ type: "text", text: rest.slice(0, best.index) });
    out.push(best.make(best.match));
    rest = rest.slice(best.index + best.match[0].length);
  }
  return out;
}

export function plainText(text: string): string {
  const flatten = (nodes: Inline[]): string =>
    nodes
      .map((node) => {
        if (node.type === "text" || node.type === "code") return node.text;
        if (node.type === "image") return node.alt;
        if (node.type === "break") return " ";
        return flatten(node.children);
      })
      .join("");
  return flatten(parseInline(text));
}
