import { existsSync } from "node:fs";
import path from "node:path";

export const INTENT_BIN = path.join("node_modules", ".bin", "intent");

const DESCRIPTION_LIMIT = 200;

export function findRepositoryRoot(filePath: string): string | undefined {
  let dir = path.dirname(path.resolve(filePath));
  for (;;) {
    if (existsSync(path.join(dir, ".git"))) return dir;
    const parent = path.dirname(dir);
    if (parent === dir) return undefined;
    dir = parent;
  }
}

function shorten(text: string): string {
  const oneLine = text.replace(/\s+/g, " ").trim();
  return oneLine.length > DESCRIPTION_LIMIT
    ? `${oneLine.slice(0, DESCRIPTION_LIMIT - 1)}…`
    : oneLine;
}

function skillLine(value: unknown): string | undefined {
  if (typeof value !== "object" || value === null) return undefined;
  const { use, description } = value as Record<string, unknown>;
  if (typeof use !== "string") return undefined;
  return `- \`${use}\`: ${shorten(typeof description === "string" ? description : "")}`;
}

export function formatCatalog(list: unknown, root: string): string | undefined {
  if (typeof list !== "object" || list === null) return undefined;
  const { skills, hiddenSourceCount } = list as Record<string, unknown>;
  const lines = [...new Set((Array.isArray(skills) ? skills : []).map(skillLine))].filter(
    (line) => line !== undefined,
  );
  const hidden = typeof hiddenSourceCount === "number" ? hiddenSourceCount : 0;
  if (lines.length === 0 && hidden === 0) return undefined;
  return [
    `Before your first edit in ${root}, check the agent skills that its dependencies ship with TanStack Intent.`,
    `If one matches the change, load it with \`cd ${root} && ./${INTENT_BIN} load <package>#<skill>\` and follow it, then retry the edit. This check runs once per repository per session.`,
    ...lines,
    ...(hidden > 0
      ? [
          `${hidden} more installed packages ship skills that \`intent.skills\` in ${root}/package.json hides from agents. Setting it to \`["*"]\` shows them.`,
        ]
      : []),
  ].join("\n");
}
