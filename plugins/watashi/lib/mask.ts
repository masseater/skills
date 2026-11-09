import type { Detector, Finding } from "./betterleaks.ts";

export type Masked = { text: string; redactions: number };

export class MaskingIncomplete extends Error {}

const MAX_PASSES = 3;

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

type Line = { raw: string; json: JsonValue | undefined };

const isRecord = (value: JsonValue): value is { [key: string]: JsonValue } =>
  typeof value === "object" && value !== null && !Array.isArray(value);

function parseLine(raw: string): Line {
  if (raw === "") return { raw, json: undefined };
  try {
    return { raw, json: JSON.parse(raw) as JsonValue };
  } catch {
    return { raw, json: undefined };
  }
}

const isMediaData = (parent: { [key: string]: JsonValue }, key: string): boolean =>
  key === "data" && parent["type"] === "base64";

const isThinkingSignature = (parent: { [key: string]: JsonValue }, key: string): boolean =>
  (key === "signature" && parent["type"] === "thinking") ||
  (key === "data" && parent["type"] === "redacted_thinking");

const isOpaque = (parent: { [key: string]: JsonValue }, key: string): boolean =>
  isMediaData(parent, key) || isThinkingSignature(parent, key);

function collectStrings(value: JsonValue, out: string[]): void {
  if (typeof value === "string") {
    out.push(value);
    return;
  }
  if (Array.isArray(value)) {
    for (const item of value) collectStrings(item, out);
    return;
  }
  if (isRecord(value)) {
    for (const [key, item] of Object.entries(value)) {
      if (!isOpaque(value, key)) collectStrings(item, out);
    }
  }
}

export type View = { text: string; owners: number[] };

export function scanView(lines: readonly Line[]): View {
  const strings: string[] = [];
  const owners: number[] = [];
  lines.forEach((line, index) => {
    const own: string[] = [];
    if (line.json === undefined) {
      if (line.raw !== "") own.push(line.raw);
    } else {
      collectStrings(line.json, own);
    }
    for (const value of own) {
      strings.push(value);
      for (let n = value.split("\n").length; n > 0; n -= 1) owners.push(index);
    }
  });
  return { text: strings.join("\n"), owners };
}

const isAscii = (text: string): boolean => /^[\x00-\x7f]*$/u.test(text);

function targetOf(finding: Finding, view: string, viewLines: readonly string[]): string {
  if (!finding.encoded && finding.secret !== "" && view.includes(finding.secret)) {
    return finding.secret;
  }
  const lines = viewLines.slice(finding.startLine - 1, finding.endLine);
  const first = lines[0] ?? "";
  if (lines.length === 1 && isAscii(first) && finding.endColumn >= finding.startColumn) {
    const span = first.slice(finding.startColumn - 1, finding.endColumn);
    if (span !== "") return span;
  }
  return lines.join("\n");
}

export function targetsOf(findings: readonly Finding[], view: string): Map<string, string> {
  const viewLines = view.split("\n");
  const targets = new Map<string, string>();
  for (const finding of findings) {
    const target = targetOf(finding, view, viewLines);
    if (target !== "" && !targets.has(target)) targets.set(target, finding.ruleId);
  }
  return targets;
}

type Replacer = (text: string) => { text: string; count: number };

function replacerOf(targets: Map<string, string>): Replacer {
  const ordered = [...targets.entries()].sort(([a], [b]) => b.length - a.length);
  return (text) => {
    let result = text;
    let count = 0;
    for (const [target, ruleId] of ordered) {
      if (!result.includes(target)) continue;
      const parts = result.split(target);
      count += parts.length - 1;
      result = parts.join(`[REDACTED:${ruleId}]`);
    }
    return { text: result, count };
  };
}

function replaceStrings(value: JsonValue, replace: Replacer, counter: { count: number }): JsonValue {
  if (typeof value === "string") {
    const replaced = replace(value);
    counter.count += replaced.count;
    return replaced.text;
  }
  if (Array.isArray(value)) return value.map((item) => replaceStrings(item, replace, counter));
  if (isRecord(value)) {
    const out: { [key: string]: JsonValue } = {};
    for (const [key, item] of Object.entries(value)) {
      out[key] = isOpaque(value, key) ? item : replaceStrings(item, replace, counter);
    }
    return out;
  }
  return value;
}

function applyTargets(lines: readonly Line[], targets: Map<string, string>): { lines: Line[]; count: number } {
  const replace = replacerOf(targets);
  let count = 0;
  const next = lines.map((line): Line => {
    if (line.json === undefined) {
      const replaced = replace(line.raw);
      count += replaced.count;
      return replaced.count === 0 ? line : { raw: replaced.text, json: undefined };
    }
    const counter = { count: 0 };
    const json = replaceStrings(line.json, replace, counter);
    count += counter.count;
    return counter.count === 0 ? line : { raw: JSON.stringify(json), json };
  });
  return { lines: next, count };
}

const KEPT_KEYS = ["type", "uuid", "parentUuid", "timestamp", "sessionId"];

function redactedLine(line: Line): Line {
  const kept: { [key: string]: JsonValue } = { type: "watashi-redacted-line" };
  if (line.json !== undefined && isRecord(line.json)) {
    for (const key of KEPT_KEYS) {
      const value = line.json[key];
      if (value !== undefined) kept[key === "type" ? "originalType" : key] = value;
    }
  }
  return { raw: JSON.stringify(kept), json: kept };
}

function redactOwners(lines: readonly Line[], findings: readonly Finding[], view: View): Line[] {
  const owned = new Set<number>();
  for (const finding of findings) {
    for (let at = finding.startLine; at <= finding.endLine; at += 1) {
      const owner = view.owners[at - 1];
      if (owner !== undefined) owned.add(owner);
    }
  }
  return lines.map((line, index) => (owned.has(index) ? redactedLine(line) : line));
}

const joined = (lines: readonly Line[]): string => lines.map((line) => line.raw).join("\n");

export function maskText(text: string, detect: Detector): Masked {
  let lines = text.split("\n").map(parseLine);
  let redactions = 0;
  for (let pass = 0; pass < MAX_PASSES; pass += 1) {
    const view = scanView(lines);
    const findings = detect(view.text);
    if (findings.length === 0) return { text: joined(lines), redactions };
    const applied = applyTargets(lines, targetsOf(findings, view.text));
    if (applied.count === 0) {
      lines = redactOwners(lines, findings, view);
      redactions += findings.length;
      continue;
    }
    lines = applied.lines;
    redactions += applied.count;
  }
  const view = scanView(lines);
  const remaining = detect(view.text);
  if (remaining.length === 0) return { text: joined(lines), redactions };
  lines = redactOwners(lines, remaining, view);
  redactions += remaining.length;
  if (detect(scanView(lines).text).length === 0) return { text: joined(lines), redactions };
  throw new MaskingIncomplete("secrets remained after masking; refusing to send");
}
