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

### What a plugin is for

A plugin exists to lower the owner's cognitive load: what the owner has to read, keep in mind and type by hand.

- Judge a design by whether that load drops, not by whether the output matches a style. A style is one means and is replaced when another means lowers the load more.
- Design for how the owner actually reads and works, including the UI the output lands in and what the owner is doing while waiting.
- When the owner repeats an instruction by hand, make the harness do it with a hook, a mod or a check, instead of adding prompt text that a model may skip.
- Support only Claude Code and claude.ai. Do not add branches or fallbacks for other agents or tools.
- Use the features of Claude Code and claude.ai to the full before building a mechanism of your own. Read the current documentation each time, because the features change every week.
- A plugin calls models through two paths only: `claude -p`, and a decision model through Cloudflare AI Gateway. A decision model judges and a generating model writes, so do not substitute one for the other.
- A plugin works for anyone who installs it. Do not make it depend on the owner's own MCP servers, Workers or accounts. A plugin that calls a decision model reads the user's own Cloudflare account ID and API token from its `userConfig`, with the token marked `sensitive`.

### Mods

A plugin whose `hooks/hooks.json` lists `modules` is a mod: a hooks module that runs inside Claude Code. `cogload` is one. Read Claude Code's `plugin-authoring` skill before changing a mod, because the mod API changes between releases. Check a mod with `claude plugin validate plugins/<plugin>` and `claude plugin test plugins/<plugin>`. A mod's tests sit directly in its `hooks/` and run on Claude Code's own test runner, so `vp test run` skips them and `plugins/mods.test.ts` runs them.

- A decision model in a mod selects and never rewrites, and the mod shows the original whenever the call fails, the token is missing or the model is unsure. A question the owner never sees costs more than an extra line.
- Each file that reads or writes mod state defines its own `atom`, because `claude plugin validate` reads state keys from the file that uses them.

## Commands

```sh
vp exec skills-ref validate plugins/<plugin>/skills/<name>   # validate frontmatter and layout
vp dlx skills init <name>                   # scaffold a SKILL.md
```

The skill list in each plugin's README.md is rewritten from each `SKILL.md`'s `name` and `description` by `.vite-hooks/pre-commit` running `vp run readme` on every commit that includes a `SKILL.md`, and is included in the commit. Do not edit it by hand. `vp install` enables the hook.

There is no build or lint. `./node_modules/.bin/vp run test` runs msch's checks, the plugin tests and manifest validation, and also runs on pre-push. msch needs Node.js 26 or later. After changing a skill, pass `skills-ref validate` and check that referenced files exist. Only `masseater-ecosystem` may name other skills, and every skill must be listed there. The tests check both.

## Workflow

Create a branch, open a PR and squash-merge it. Do not use mergify. After merging, recreate the branch from main.
