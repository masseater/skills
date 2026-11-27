---
name: check-similar-code
description: Find similar functions across masseater repositories and merge them into one, using fallow similar-code. Use when running the similar code check of the daily audit.
---

# check-similar-code

## Why this skill exists and the state it aims for

This skill exists because copied code is rejected by verify, but code that does the same thing in a different shape is not, so it piles up and every copy has to be changed together. The state it aims for is that no repository holds two functions doing the same thing.

## Rules

- Follow the similar-code step of the repeated-corrections sweep that the hub points to for each repository: candidates come from `fallow similar-code` and each is read with `inspect`.
- Merge every candidate: keep one function and point its callers at it. Judge by what the functions do, not by whether the code looks alike.
- Do not record a verdict. There is no verdict file, and a candidate that stays is not an answer.
- When merging is genuinely wrong, for example because two packages must stay free of a shared dependency, do not merge and do not record it. Report the pair and the reason to the owner.
