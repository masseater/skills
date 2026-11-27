---
name: check-similar-code
description: Find similar functions across masseater repositories that should be merged into one abstraction, using fallow similar-code. Use when running the similar code check of the daily audit.
---

# check-similar-code

## Why this skill exists and the state it aims for

This skill exists because copied code is rejected by verify, but similar code cannot be: two functions may look alike without being identical, so no gate can reject them. Similar code means an abstraction is missing, and a verdict file that calls a pair intentional hides the missing abstraction. The state it aims for is that no similar-code candidate remains and no repository keeps a verdict file.

## Rules

- Change nothing. Return the merges as concrete changes for the owner.
- Follow the similar-code step of the repeated-corrections sweep that the hub points to for each repository: candidates come from `fallow similar-code`, and each is read with `inspect`.
- For each candidate, name the abstraction that is missing and the API that fits every caller. Do not propose a verdict, and do not call a similarity intentional.
- List every `similar-code-verdicts.json` in the repository as a file to delete once its candidates are merged.
- End the instruction with a rerun of `fallow similar-code` that lists no candidates.
