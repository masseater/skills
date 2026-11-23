---
name: adopt-library-features
description: Read the release notes of the library versions masseater repositories use now and rewrite code to use new features that make it more efficient. Use when running the library feature adoption step of the daily audit.
---

# adopt-library-features

## Why this skill exists and the state it aims for

This skill exists because a library update lands the version but not its features: the code keeps the old way until someone reads the release notes, and the new way never gets used. The state it aims for is that the code uses what the installed versions offer, with existing code migrated and the use enforced mechanically.

## Rules

- This skill changes code. Open pull requests, run verify and merge them through the merge queue yourself.
- Library updates themselves are Renovate's work. Leave them alone.
- List the current versions in all repositories, then read the release notes and changelogs up to today's latest. Always cover pnpm, Node.js, TypeScript, Effect, oxlint, Vite+, Alchemy and `@tanstack/*`, and as many other libraries as you can.
- Look for places where a feature of the installed version makes the implementation more efficient or effective, and rewrite them. Adopt each one the way the hub prescribes for adopting a library: migrate existing code and enforce the use mechanically.
- Changelogs: `raw.githubusercontent.com` for the Effect, Alchemy and oxc changelogs, and unpkg for the pnpm changelog. Read Vite+ and TypeScript releases through the web fetch agent.
- Report only what changed, with the pull request links. When the pull requests are merged or closed, this step is done.
