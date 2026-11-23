---
name: check-repeated-corrections
description: Find violations no static check catches in all masseater repositories, so the owner never has to make the same correction twice. Use when running the repeated corrections check of the daily audit.
---

# check-repeated-corrections

## Why this skill exists and the state it aims for

This skill exists because a correction the owner makes by hand is lost once the conversation ends, so the same mistake returns. The state it aims for is that the owner does not have to say the same thing twice: what a gate cannot see is found across all of main, and whatever can be decided deterministically becomes a check.

## Rules

- Change nothing. Return findings as concrete fixes for the owner.
- Follow the repeated-corrections sweep that the hub points to, reading all of main in every repository, not only recent changes.
- Look for documentation that restates what the code says, inline scripts that should be Vite+ tasks, workflow jobs repeated with different parameters or existing for one workspace, and exceptions that no longer do anything: disabled rules, ignore patterns, allowlist words, overrides, suppression directives and `cache: false`.
- For each exception, determine whether removing it changes any check result. For `cache: false`, run the task twice and see whether the second run hits the cache and restores the same output.
- For anything a deterministic check could have found, ask for a check with tests in the msch package of masseater.dev. A correction found twice is a missing check.
