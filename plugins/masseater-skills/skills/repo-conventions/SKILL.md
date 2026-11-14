---
name: repo-conventions
description: Rules common to masseater's repositories. Read when starting work in a repository created from masseater/typescript-template, or in a repository whose AGENTS.md points to this skill.
---

# repo-conventions

- The rules in the repository's AGENTS.md and CLAUDE.md take precedence over this skill
- Follow vite-plus for running commands, measure-dont-guess for measurement, and dont-it-yourself for finding what already exists
- Work is complete when `vp run verify` passes

## Why this skill is needed and the state it should achieve

This skill is needed because masseater's repositories are all created from the same template and share the same rules. If the rules are copied into each repository's AGENTS.md, every fix means rewriting every repository, and work proceeds under old rules in the repositories that were missed.

The state this skill should achieve is that work proceeds under the same rules in every repository, and only what is specific to that repository remains in its AGENTS.md.

## How to choose means

Choose means of enforcement, recommendation and instruction in the following order. When building something yourself, record in the commit message what you looked for and what did not fit.

1. The library's official means of integration: lint rules, skills, plugins, CLIs, diagnostics and so on
2. Existing libraries and tools that achieve it
3. Blogs, issues and discussions that propose a policy
4. Building it yourself

Follow masseater-ecosystem for the boundary of how much to build yourself and from where to borrow, and for the finished form of the tech stack.

Do not disable or simplify settings, lower thresholds, or use suppression directives to make checks pass. Keep numeric settings at the tool's defaults, and set them by the official guidelines only when the check does not work with the defaults. A loosened check guarantees nothing even when it passes.

## Do not use Python

Do not use Python. Put it nowhere in code, scripts, CI, verification or dependencies. The languages are narrowed to TypeScript and Rust, and putting Python in even one place means keeping a runtime, package management and version pinning for it in both sessions and CI.

- Do not put Python files such as `.py`, `.ipynb`, `pyproject.toml`, `requirements.txt` or `uv.lock`
- Do not call `python`, `pip`, `pipx`, `uv`, `uvx` or `poetry` from workflows, hooks, tasks or scripts. Do not use `actions/setup-python` or `astral-sh/setup-uv` either
- Do not write Python or its tools in mise, renovate or MCP settings
- When a library or tool that only runs on Python is needed, replace it with another means that runs on TypeScript or Rust. Stop using what cannot be replaced, and write what you stopped in the report
- Do not write even one-off investigations or conversions in Python
- msch detects these and fails `vp run verify`

## Build the way of checking first

When building a mechanism such as a feature, tool, workflow, screen or infrastructure, decide and build the method of confirming that it works first, and start the implementation after that. If the way of checking is postponed, the thing gets finished in a form that cannot be checked, and confirmation becomes an agent eyeballing it each time.

- Make the way of checking something anyone can reproduce with one command, returning the same verdict for the same input, and put it in `vp run verify`. Tests, types, lint and snapshot comparisons fall under this. A check that is not in verify will not be run by anyone at the next change
- For appearance, compare images rendered headlessly with baseline images pixel by pixel. Send operations from tests
- Do not make a check that an agent or a person runs and looks at each time to judge into the way of checking. It is slow, costs money, and its verdict wavers
- If the current environment has no means of checking, make preparing such a means, such as headless rendering, stubs or a test host, the first piece of work
- Do not leave the parts behind a login or Access as "cannot be checked because it needs the owner's authentication". Make building a mechanism by which AI gets in through the same path as the owner's authentication the first step of the plan. Load debug-like-a-human before writing the plan
- Write tests that confirm the acceptance criteria first, confirm that they fail, and then implement
- Leave only the parts that cannot be checked statically, such as external services in production, real devices, listening and judgments of taste, and write what remains in the report

## Documents

- Hand-written prose is limited to the root CLAUDE.md, README.md, ARCHITECTURE.md and DESIGN.md, and docs/. Do not write what can be learned by reading the code
- In ARCHITECTURE.md, write briefly only the map of workspaces and layers and invariants such as the allowed directions of dependency. Do not write what changes often, and do not make names links. Do not sync it every time things change; fix it only when boundaries or invariants change
- Write the "why" in commit messages
- If there are deploy targets or things published externally (sites, APIs, npm packages and so on), list their URLs in the README

## Placement

- Put everything, including configuration, inside the workspace
- Divide the workspace into apps, libs, tools and infra, put apps' deploy settings in apps, and use components from infra
- Put only FSD layers directly under an app's src/. Place things near where they are used, and do not extract them until they are reused
- Define constants, configuration values, schemas and rule IDs in one place, and refer to them from there everywhere else

## Code

- Handle UI state only with effect-atom and server state only with TanStack Query
- Represent state as a discriminated union with an exclusive status, and do not use sets of boolean flags
- Pass values whose types a library provides to `Schema.decode*` with those types as they are. If you receive them as `unknown`, the compiler can no longer find mismatches between the library's types and the Schema
- Do not copy types, schemas, enums or constants that a library exports
- Do not wrap clients for external APIs by hand; choose in this order: official Effect packages, distilled.cloud (`@distilled.cloud/cloudflare` for Cloudflare), generation from a published OpenAPI with `@effect/openapi-generator`
- Make environment variables only the values that change per environment. Put values that do not change in code or Alchemy settings, or in flags if the tool has them. Each additional environment variable adds consideration of what to set in which environment
- For settings Alchemy lacks, define a custom resource rather than patching alchemy

## CI

- For workflow steps, refer to the composite actions in `.github/actions/` of masseater/typescript-template (verify, autofix, skills-lock, update-branches, credentials, ci-telemetry) as `masseater/typescript-template/.github/actions/<name>@<sha>`. If the steps are copied into each repository, every fix means rewriting every repository. renovate bumps the sha
- Put repository-specific tools (go, weaver, apt dependencies and so on) in that repository's `.github/actions/setup`, and call it from jobs as `$/.github/actions/setup`. actionlint does not know `$/` yet, so ignore just that one case in `.github/actionlint.yaml`
- The credentials action receives the Cloudflare, OpenRouter and Claude tokens from credentials.masseater.dev. Do not put them in GitHub Secrets
- Workflows in which a bot pushes to a branch (autofix, skills-lock, update-branches) push with the GitHub App token issued by the broker. If they push with `GITHUB_TOKEN`, the `up-to-date` of `pull_request` stops waiting for approval (action_required), and the PR stays unmerged. The broker issues permissions by workflow file name, so when you add a bot workflow, also add it to `WORKFLOW_GITHUB_GRANTS` in `credential-grants.ts` in masseater.dev
- Open bot PRs with auto-merge. For PRs that fell behind as main advanced, `update-branches.yml` takes in main
- `.claude/skills` is a link to `.agents/skills`, so track `.agents/skills/.gitkeep`. Without the link target, Actions fails when taking in the composite actions

## PRs and merging

- Do not do PR reviews, or per-PR CI, behavior verification or deploys. Confirm behavior in production after merging into main and deploying
- Before merging, take in the base, pass `vp run verify` locally, and merge yourself. Do not ask whether you may merge
- Do not use ruleset bypasses or `--admin`
- Recreate release-please's release PR by running `verify` manually. A manual run creates the PR with the App's token, so `up-to-date` runs without approval

## Vulnerabilities

- Fix ZAP alerts right away, including warnings. Write only false positives in `.github/zap/rules.tsv`
- Fix `audit` with `vp pm audit --fix`. Put only advisories without a fixed version in `audit.ignore`, and write the reason in the commit message

## Skills

- Before editing, run `vp exec intent list` at the repository root. If a skill fits, read it with `vp exec intent load <package>#<skill>`. If `intent` is not available, do not install it; report the gap
- Put your own skills used across multiple repositories in masseater/skills, and install them with the skills CLI

## Starting a session

When starting a session that interacts with the user, if you are asked to check for template updates, finish that first, then start `/loop` with no arguments. Its content is in the repository's `.claude/loop.md`.

## References

In repositories where they apply, also read the following.

- [`cloudflare`](references/cloudflare.md). Rules for repositories that deploy to Cloudflare
- [`oxlint-plugin-decision`](references/oxlint-plugin-decision.md). Rules for repositories that use decision rules in `vp check`
- [`instrumentation`](references/instrumentation.md). Rules for spans, CI measurement and Web Vitals. Workers traces use `@r_masseater/workers-tracing`, checking telemetry in tests uses `@r_masseater/vitest-otlp`, and Web Vitals use `@r_masseater/web-vitals-flow`

## Use cases

- [`publish-npm-package`](usecases/publish-npm-package.md). Publish a package to npm
