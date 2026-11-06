/**
 * 送る前に訳すツールの入力の場所
 *
 * キーはツールの名前、値は入力の中の文字列の場所である。`[]` は配列の各要素を指す。
 * 長さに上限のある入力（request_decision の選択肢など）は、訳すと上限を超えうるので載せない。
 * hooks.json の PreToolUse の matcher は、このキーと同じ並びにする。
 */
export const TRANSLATED_FIELDS: Record<string, string[]> = {
  AskUserQuestion: [
    "questions[].question",
    "questions[].options[].label",
    "questions[].options[].description",
  ],
  mcp__hearthbot__post_message: ["text"],
  mcp__hearthbot__edit_message: ["text"],
  mcp__hearthbot__update_progress_checklist: ["text"],
};

type Slot = { get: () => string; set: (value: string) => void };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function collect(node: unknown, segments: string[], out: Slot[]): void {
  const [segment, ...rest] = segments;
  if (segment === undefined || !isRecord(node)) return;
  if (segment.endsWith("[]")) {
    const items = node[segment.slice(0, -2)];
    if (Array.isArray(items)) for (const item of items) collect(item, rest, out);
    return;
  }
  if (rest.length > 0) {
    collect(node[segment], rest, out);
    return;
  }
  const value = node[segment];
  if (typeof value === "string") {
    out.push({ get: () => value, set: (next) => (node[segment] = next) });
  }
}

/**
 * ツールの入力の決まった場所の文字列を訳す
 *
 * @param input - ツールの入力。書き換えず、写しを返す
 * @param paths - 訳す場所
 * @param translate - 文字列を訳す
 * @returns 訳した入力と、1 か所でも変わったか
 */
export async function translateToolInput(
  input: unknown,
  paths: string[],
  translate: (text: string) => Promise<string>,
): Promise<{ value: unknown; changed: boolean }> {
  const value = structuredClone(input);
  const slots: Slot[] = [];
  for (const p of paths) collect(value, p.split("."), slots);
  const translated = await Promise.all(slots.map((slot) => translate(slot.get())));
  let changed = false;
  slots.forEach((slot, i) => {
    const next = translated[i];
    if (next === undefined || next === slot.get()) return;
    slot.set(next);
    changed = true;
  });
  return { value, changed };
}
