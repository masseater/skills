import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, basename } from "node:path";

// writing の SKILL.md の索引（作業の段と読むもの、用途）を、
// skills/writing/index.json から生成する。
// 索引に載らないファイルは index.json の via に理由つきで置く。
// --check では生成結果との一致に加えて、索引の網羅、記事手順から
// 共通手順への参照、相対リンクの実在を検査する。

const root = join(import.meta.dirname, "..");
const writingDir = join(root, "skills", "writing");
const skillPath = join(writingDir, "SKILL.md");
const manifest = JSON.parse(readFileSync(join(writingDir, "index.json"), "utf8"));

const linkOf = (file) => {
  const name = basename(file, ".md");
  return `- [\`${name}\`](${file})。`;
};

const stagesBody = manifest.stages
  .map((stage) => `### ${stage.name}\n\n${stage.items.map((item) => `${linkOf(item.file)}${item.summary}`).join("\n")}`)
  .join("\n\n");

const usecasesBody = manifest.usecases
  .map((block) => {
    if (block.text) return block.text;
    return block.bullets.map((item) => `${linkOf(item.file)}${item.summary}`).join("\n");
  })
  .join("\n\n");

const replaceSection = (text, startMarker, endMarker, body) => {
  const start = text.indexOf(startMarker);
  const end = text.indexOf(endMarker);
  if (start === -1 || end === -1 || end < start) {
    throw new Error(`SKILL.md に ${startMarker} と ${endMarker} の区間がない`);
  }
  return `${text.slice(0, start + startMarker.length)}\n\n${body}\n\n${text.slice(end)}`;
};

const skill = readFileSync(skillPath, "utf8");
let next = replaceSection(skill, "<!-- writing-stages:start -->", "<!-- writing-stages:end -->", stagesBody);
next = replaceSection(next, "<!-- writing-usecases:start -->", "<!-- writing-usecases:end -->", usecasesBody);

const problems = [];

if (process.argv.includes("--check")) {
  if (next !== skill) {
    problems.push("SKILL.md の索引が古い。vp run writing-index で書き直す。");
  }

  // 索引の網羅: references/ と usecases/ の全ファイルが、索引か via にあること
  const covered = new Set();
  for (const stage of manifest.stages) for (const item of stage.items) covered.add(item.file);
  for (const block of manifest.usecases) {
    if (block.text) {
      for (const m of block.text.matchAll(/\]\(([^)]+)\)/g)) covered.add(m[1]);
    }
    if (block.bullets) for (const item of block.bullets) covered.add(item.file);
  }
  for (const entry of manifest.via ?? []) covered.add(entry.file);

  const onDisk = [];
  for (const dir of ["references", "usecases"]) {
    for (const entry of readdirSync(join(writingDir, dir))) {
      if (entry.endsWith(".md")) onDisk.push(`${dir}/${entry}`);
    }
  }
  for (const file of onDisk) {
    if (!covered.has(file)) problems.push(`${file} が索引にも via にもない。index.json に追加する。`);
  }
  for (const file of covered) {
    if (!existsSync(join(writingDir, file))) problems.push(`index.json の ${file} が存在しない。`);
  }

  // 記事の種類ごとの手順は、共通手順 article への参照を持つこと
  for (const file of onDisk) {
    if (file.startsWith("usecases/article-") && file !== "usecases/article.md") {
      const body = readFileSync(join(writingDir, file), "utf8");
      if (!body.includes("](article.md)")) problems.push(`${file} に共通手順 article への参照がない。`);
    }
  }

  // 相対リンクの実在（"URL" のようなプレースホルダは除く）
  const checkLinks = (dir) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const path = join(dir, entry.name);
      if (entry.isDirectory()) checkLinks(path);
      if (!entry.isFile() || !entry.name.endsWith(".md")) continue;
      const body = readFileSync(path, "utf8");
      for (const m of body.matchAll(/\]\(([^)#\s]+)(?:#[^)]*)?\)/g)) {
        const target = m[1];
        if (/^(https?:|mailto:)/.test(target) || !target.includes(".")) continue;
        if (!existsSync(join(path, "..", target))) {
          problems.push(`${path.slice(root.length + 1)} のリンク先 ${target} が存在しない。`);
        }
      }
    }
  };
  checkLinks(writingDir);

  if (problems.length > 0) {
    for (const problem of problems) console.error(problem);
    process.exit(1);
  }
  console.log("writing の索引と構造は index.json と一致している。");
} else if (next !== skill) {
  writeFileSync(skillPath, next);
  console.log("SKILL.md の索引を書き直した。");
}
