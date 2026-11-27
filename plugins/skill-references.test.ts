import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vite-plus/test";

const hub = "masseater-ecosystem";
const roots = [
  path.resolve(import.meta.dirname, "masseater-skills", "skills"),
  path.resolve(import.meta.dirname, "cogload", "skills"),
  path.resolve(import.meta.dirname, "cross-similar-code", "skills"),
];
const rootOf = new Map(
  roots.flatMap((root) => {
    return readdirSync(root, { withFileTypes: true })
      .filter((entry) => entry.isDirectory() && existsSync(path.join(root, entry.name, "SKILL.md")))
      .map((entry) => [entry.name, root] as const);
  }),
);
const skills = [...rootOf.keys()].sort();
const skillsRoot = (skill: string): string => rootOf.get(skill) ?? "";
const others = skills.filter((skill) => skill !== hub);
const hubText = readFileSync(path.join(skillsRoot(hub), hub, "SKILL.md"), "utf8");

function markdownOf(skill: string): string[] {
  return readdirSync(path.join(skillsRoot(skill), skill), { recursive: true, encoding: "utf8" })
    .filter((file) => file.endsWith(".md"))
    .map((file) => path.join(skill, file));
}

function names(text: string, skill: string): boolean {
  return new RegExp(`(?<![\\w/.@#-])${skill}(?![\\w/#-]|\\.[a-z])`).test(text);
}

describe("skill references", () => {
  it("has the hub", () => {
    expect(skills).toContain(hub);
  });

  it("lists every skill in the hub", () => {
    expect(others.filter((skill) => !names(hubText, skill))).toEqual([]);
  });

  it("names only existing skills in the hub", () => {
    const written = [...hubText.matchAll(/`([a-z0-9]+(?:-[a-z0-9]+)*)`(?!\]\()/g)].map((match) => match[1]);
    expect(written.length).toBeGreaterThan(0);
    expect(written.filter((name) => !skills.includes(name))).toEqual([]);
  });

  it.each(others)("%s names no skill other than the hub", (skill) => {
    const found = markdownOf(skill).flatMap((file) => {
      const text = readFileSync(path.join(skillsRoot(skill), file), "utf8");
      return others.filter((other) => other !== skill && names(text, other)).map((other) => `${file}: ${other}`);
    });
    expect(found).toEqual([]);
  });
});
