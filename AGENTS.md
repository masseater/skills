# AGENTS.md

This repository holds the agent skills shared by masseater's repositories. The root is a Claude Code plugin marketplace.

- Follow `skill-authoring` when creating or fixing a skill.
- Follow `writing` for prose, and `humanity-and-humanness` for what to assume about human readers.
- Write docs, commit messages and PR bodies in Japanese. AGENTS.md is the exception and is written in English.

## Layout

Put each skill in its own `plugins/<plugin>/skills/<name>/`, with `name` equal to the directory name. One document holds one kind of content.

- `SKILL.md` holds why the skill is needed, the state it aims for, and its rules.
- `usecases/` holds procedures.
- `references/` holds references specific to particular repositories or environments, and the details of rules.

`metadata.derived-from` lists only the URLs of sources whose content was taken in and adapted, as permalinks pinned to a commit. Link sources that were only read or are cited as grounds from the body.

## Plugins

Put each plugin in its own `plugins/<plugin>/` with a `package.json`, a `README.md` and a `.claude-plugin/plugin.json`. msch generates `.claude-plugin/marketplace.json` from them, so do not edit it by hand. Hooks take no dependencies, and hooks and scripts are written in TypeScript that Node.js runs as is (code that works once type annotations are stripped).

## Commands

```sh
vp exec skills-ref validate plugins/<plugin>/skills/<name>   # validate frontmatter and layout
vp dlx skills init <name>                   # scaffold a SKILL.md
```

The skill list in each plugin's README.md is rewritten from each `SKILL.md`'s `name` and `description` by `.vite-hooks/pre-commit` running `vp run readme` on every commit that includes a `SKILL.md`, and is included in the commit. Do not edit it by hand. `vp install` enables the hook.

There is no build or lint. `./node_modules/.bin/vp run test` runs msch's checks, the plugin tests and manifest validation, and also runs on pre-push. msch needs Node.js 26 or later. After changing a skill, pass `skills-ref validate` and check that referenced files exist. Only `masseater-ecosystem` may name other skills, and every skill must be listed there. The tests check both.

## Workflow

Create a branch, open a PR and squash-merge it. Do not use mergify. After merging, recreate the branch from main.
