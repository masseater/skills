---
name: check-upstream-exits
description: Find upstream deviations (overrides, patches, package extensions, Cargo patches) whose exit condition is now met, from the daily msch-exits run in masseater.dev. Use when running the upstream exit check of the daily audit.
---

# check-upstream-exits

## Why this skill exists and the state it aims for

This skill exists because an upstream deviation is temporary by definition, and the day it stops being needed no one is looking: the patch stays, drifts from upstream, and breaks a later upgrade. The state it aims for is that the moment an exit condition is met, one thread removes the deviation.

## Rules

- Change nothing. Return findings as concrete fixes for the owner.
- Read the latest run of `daily.yml` in masseater.dev and its root `daily` job through the GitHub MCP tools. The job runs `msch-exits` where npm, crates.io and GitHub lookups work; cloud sessions get 403 from the GitHub API directly.
- If the job failed, collect each line of the form `<file>:<line> <section> <key>: the exit condition ... is met`.
- For every met entry, name one owner for a single pull request that removes the entry and its patch file and passes verify. If verify still needs the deviation, the pull request replaces the condition with the next event.
- Report a `could not be checked` entry as a finding of its own.
