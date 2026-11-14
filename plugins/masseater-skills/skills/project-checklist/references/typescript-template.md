# The skeleton of typescript-template

Gaps in a migration from the template do not show up as build or test failures. Even if one hook is missing, or old settings remain alongside, verify passes.

- Judge each element on three points: whether it is introduced, whether it works, and whether any old structure remains
- Judge introduction by whether the files and dependencies actually exist
- Judge function by whether the mechanism that runs it is connected and actually executes. A hook that is only in a configuration file, or a condition that can never fire in this repository, is not working
- Judge old structure by whether replaced old mechanisms or duplicated settings with the same role remain
- The truth of the details lies in the actual template: the root `vite.config.ts`, `.claude/hooks/`, `.vite-hooks/`, `.github/workflows/` and `apps/*/`. Do not use this list as a copy
- Do not count elements added in a new release of the template as insufficient. That is not a gap in the migration but an update not yet taken in. Taking it in is guided by the template's update mechanism
- Do not count something that works, even in an old form, as insufficient. Only things whose absence breaks something or silently disables something can be called insufficient

## 1. The tooling is Vite+ alone

- Introduction: the root and each app have a `vite.config.ts`, the scripts in `package.json` go through vp, and `devEngines` is pnpm.
- Function: `git config core.hooksPath` points to `.vite-hooks/_`, and `.vite-hooks/{pre-commit,commit-msg,pre-push}` call vp. CI runs install and verify with `voidzero-dev/setup-vp`. Agents running pnpm directly is stopped by the deny in `.claude/settings.json` and `block-pnpm.ts`.
- Old structure: see whether turbo.json, husky, yarn, npm and bun lockfiles, and scripts and CI that call raw pnpm, npx or prettier are gone.

## 2. Dependency versions are unified in the pnpm catalog

- Introduction: `pnpm-workspace.yaml` has `catalog`, `catalogs: stack` and `catalogMode: prefer`, and dependencies refer to `catalog:` and `catalog:stack`.
- Function: syncpack in `vp run verify` passes, and multiple versions of the same dependency are not allowed.
- Old structure: see whether there are hard-coded versions of dependencies in the catalog, or different versions of the same dependency scattered across packages.

## 3. The monorepo is laid out in Nx style, with pnpm remaining the package manager

- Introduction: packages are divided into `apps/` for apps, `libs/` for shared code and `tools/` for repository tooling, and `packages` in `pnpm-workspace.yaml` lists them.
- Function: `vp install` and `vp run -r` resolve and run over the workspace packages.
- Old structure: see whether there are traces of `nx.json` or `@nx/*` having been installed, and packages scattered outside `apps/`, `libs/` and `tools/`.

## 4. Types are checked with `@effect/tsgo`

- Introduction: `@effect/tsgo` from `catalog:stack` is present, the tsconfig of every package `extends` `tsconfig.base.json`, and each app's `prepare` runs `effect-tsgo patch --typescript --oxlint`.
- Function: `typeAware: true` and `typeCheck: true` are enabled in `vp check` in `vite.config.ts`, the effect rules of `@effect/tsgo/oxlint-presets` are loaded, and `strict`, `exactOptionalPropertyTypes` and `noUncheckedIndexedAccess` in `tsconfig.base.json` remain in force.
- Old structure: see whether a custom loose tsconfig has replaced the inheritance, whether the loading of the preset was removed, and whether the patch in prepare was deleted.

## 5. Build on Effect

- Introduction: there is an `effect` dependency, and the boundaries with external input and external APIs, and the domain, are built with Effect, Layer, Context and Schema.
- Function: boundary values are passed to `Schema.decode*` with the library's types as they are, clients for external APIs are chosen in the order official Effect, distilled.cloud, generated from OpenAPI, and processing that costs time or money is visible with `Effect.withSpan`.
- Old structure: see whether there is a domain of plain Promises and try/catch, valibot or zod coexisting, or hand-written API wrappers.

## 6. Look at dead code, duplication, vulnerabilities and dependencies with fallow

- Introduction: there are `.fallowrc.jsonc`, `fallow` scripts in the root and apps, and `fallow-all` in verify.
- Function: `vp run -r fallow` runs, including type awareness and security checks, and passes. Failure conditions such as `--fail-on-issues` remain in force. Loosening them erases the meaning of green.
- Old structure: see whether replaced settings and scripts such as knip, jscpd and ts-prune are gone, and whether settings are duplicated between the rc and scripts.

## 7. The single entry point for verification is `vp run verify`

- Introduction: `vp run verify` exists as the entry point for verification. In the current template, `run.tasks.verify` in the root `vite.config.ts` and its dependsOn graph are the entry point; even with a chain of scripts, it works as long as the checks run together from one entry point.
- Function: `.vite-hooks/pre-push`, the verify job in CI and `.claude/hooks/stop-gate.ts` call the same `vp run verify`. Checks that have targets in the repository, such as test, eslint, syncpack, markdown-lint, renovate, actions-lint, steiger, db:check, fallow and audit, run from the entry point.
- Old structure: see whether there are checks scattered outside verify, tasks remaining with no target, or traces of making it green by deleting tasks.

## 8. The local and CI gates are effective

- Introduction: `.vite-hooks/` and `.github/workflows/` have the verify set. The current template has autofix, up-to-date and zap workflows, and deploy and release are jobs in the verify workflow.
- Function: the most recent verify on main is green. Check with `gh run list --branch main --limit 5`. Jobs with the names listed as required checks in the ruleset actually exist in the workflows and are actually reported. Check with `gh api repos/{owner}/{repo}/rulesets` and `gh workflow list`. Required checks that are never reported block PRs. In repositories that deploy, the deploy job is green and the URLs in the README's "where it is published" respond.
- Old structure: see whether predecessor workflows such as deploy.yml and verify-autofix.yml are gone, and whether there are conditions that can never fire in this repository, such as a release job still set to `github.repository == 'masseater/typescript-template'`.

## 9. The settings for agents are alive

- Introduction: there are the full set of `.claude/hooks/`, `.claude/settings.json`, `.claude/loop.md`, `AGENTS.md` and `CLAUDE.md`, `.intent/hooks/intent-claude-gate.mjs`, `.agents/skills` linked from `.claude/skills`, and `skills-lock.json`.
- Function: the hooks in settings.json point to files that exist and run at startup. `skills ls` and `vp exec intent list` return skills. A new release of the template is announced at session start.
- Old structure: see whether there are pre-migration `.claude/rules/`, remnants of old skills, or nonexistent files pointed to by settings.json.

## 10. Repositories that deploy declare it with Alchemy

- Introduction: there are `apps/<name>/alchemy.run.ts`, `app-name.ts` and its test, and resource names are taken from `app-name.ts`.
- Function: `vp run deploy` passes, and the deploy job in CI runs with secrets.
- Old structure: see whether there is wrangler.toml, direct calls to wrangler, or Terraform or Pulumi coexisting.

## 11. No redundant settings

- Give each role a single owner. Put the common part of tsconfig in `tsconfig.base.json`, dependency versions in the catalog, and the app name in `app-name.ts`, and make environment variables only the values that change per environment.
- Direct execution of the eslint CLI has been replaced by `vp check`, and the settings, dependencies and scripts of the old side are gone.

## 12. Delete useless documentation and useless code comments

- Introduction: `no-comments/disallowComments` is in the lint of `vite.config.ts` as an error, and only `oxlint-disable` and `eslint-disable` are allowed.
- Function: the lint in `vp run verify` rejects code that contains comments.
- Old structure: see whether comments and documents that describe history or reasons, READMEs and docs still describing the previous structure, and notes written during the migration are gone.

## 13. CI runs efficiently with diffs and caches

- Introduction: verify runs only on push to main and on manual dispatch, not on PRs. The only gate on the PR side is the `up-to-date` required check. commitlint and Betterleaks target only the pushed range, and actions-lint has a rule forbidding full-history fetches with `fetch-depth: 0`. deploy runs only when its sha is the head of the branch. Dependency installs are cached with setup-vp's `cache: true`, and oxlint-plugin-decision's judgments are carried over with `actions/cache` restore and save.
- Function: confirm with the most recent run on main. `gh run view <run-id> --log` shows the restore of the dependency cache and the oxlint-plugin-decision judgment cache, and the checks on each push target only the pushed range. Since there is no per-PR review, it is enough for the PR side to check that it keeps up with updates to main.
- Old structure: see whether there is a shape that runs verify per PR, checks that target the full history, `fetch-depth: 0`, missing cache restore or save, or a shape in which deploy runs even for an old sha.
