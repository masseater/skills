---
name: vite-plus
description: Install, run, check and test with Vite+'s `vp`. Use when running commands in a repository that uses `vite-plus`, when adding tasks or checks, and when translating generated commands.
---

# vite-plus

- For usage, read and follow the official `node_modules/vite-plus/AGENTS.md` of the installed version. Leave detailed arguments to `vp help`, `vp <command> --help` and `node_modules/vite-plus/docs`
- Run commands through `vp`. Do not use `pnpm`, `pnpx` or `npx` directly, and translate `pnpm exec` and `pnpm dlx` in generated blocks and in other tools' documents into `vp exec` and `vp dlx`
- Work is complete when `vp run verify` passes

## Why this skill is needed and the state it should achieve

This skill is needed because Vite+'s official guidance reaches each repository only by being copied into its AGENTS.md by `vp create` and `vp migrate`. There is no official Vite+ skill ([#2781](https://github.com/voidzero-dev/vite-plus/issues/2781) remains a proposal, and [#560](https://github.com/voidzero-dev/vite-plus/issues/560) was closed on the grounds that the AGENTS.md in the npm package is enough), and copies go stale each time the version goes up.

The state this skill should achieve is that the official guidance is read from the original in the package, and only the rules added for masseater's repositories are kept here. Whether run locally, in hooks or in CI, the same `vp` entry point gives the same result.

## Tasks and scripts

- Put only lifecycle scripts such as `prepare` and `prepack` in package.json's scripts. Write other commands in `run.tasks` in that package's `vite.config.ts`. Script strings cannot be type-checked, and you would not notice if a command with a row of arguments broke
- Do not create tasks that just do the same as a built-in (such as `build: "vp build"`); use `vp build` and `vp pack` directly
- Run monorepo-aware tools only once at the root. For tests, list the same globs as pnpm-workspace in the root `test.projects` and run `vp test run`; fallow looks at the whole workspace in one run at the root. Do not copy the same check task into each package. Exclude with `!` any directory matched by a `test.projects` glob that is not a package, and do not put files such as `.gitkeep` directly under the workspace. Vitest tries to load both as projects and fails
- When relying on a task of a specific package, do not create a task that wraps `vp run --filter`; write `<package name>#<task name>` in `dependsOn`. Use `vp run -r` only to run a task in every package that has a task with the same name
- Set `cache: false` for tasks that write files (build, deploy, generation, measurement)
- Files called only from tasks are invisible to fallow's analysis, so add them to `entry` in `.fallowrc.jsonc`. fallow picks up binary usage from the task strings written in the root `vite.config.ts`, so do not split `run` into a separate file

## Checks and hooks

- When adding a check, make it a task in `vite.config.ts` and put it in the `dependsOn` of `verify`. Hooks and CI run the same `verify`, so only checks put there take effect on every path
- Do not skip the pre-push hook with `--no-verify`
- Do not copy the official guidance into AGENTS.md. Do not pass `--agent` to `vp create` or `vp migrate`. If you do, a Vite+ section is added to AGENTS.md, and every later `vp config` keeps rewriting what is between the `<!--VITE PLUS START-->` markers
