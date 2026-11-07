export const NPM_MAINTAINER = "r_masseater";

export const SEARCH_URL = `https://registry.npmjs.org/-/v1/search?text=maintainer:${NPM_MAINTAINER}&size=250`;

type OwnPackage = { name: string; description: string; date: string };

function toOwnPackage(value: unknown): OwnPackage | undefined {
  if (typeof value !== "object" || value === null) return undefined;
  const pkg = (value as { package?: unknown }).package;
  if (typeof pkg !== "object" || pkg === null) return undefined;
  const { name, description, date } = pkg as Record<string, unknown>;
  if (typeof name !== "string") return undefined;
  return {
    name,
    description: typeof description === "string" ? description : "",
    date: typeof date === "string" ? date.slice(0, 10) : "",
  };
}

export function formatOwnPackages(body: unknown): string | undefined {
  const objects =
    typeof body === "object" && body !== null ? (body as { objects?: unknown }).objects : undefined;
  if (!Array.isArray(objects)) return undefined;
  const packages = objects
    .map(toOwnPackage)
    .filter((pkg) => pkg !== undefined)
    .sort((a, b) => b.date.localeCompare(a.date) || a.name.localeCompare(b.name));
  if (packages.length === 0) return undefined;
  return [
    `masseater publishes these npm packages (npm maintainer ${NPM_MAINTAINER}, read from the npm registry at session start, newest publish first).`,
    "Before writing a helper, wrapper, API client, lint rule, tracing or measurement code, or a UI component, check whether one of them already does it, and use it instead of writing your own.",
    "Read a package's README at `https://unpkg.com/<name>/README.md`.",
    ...packages.map((pkg) => `- \`${pkg.name}\` (${pkg.date}): ${pkg.description}`),
  ].join("\n");
}
