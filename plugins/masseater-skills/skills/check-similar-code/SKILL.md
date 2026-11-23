---
name: check-similar-code
description: Find similar functions across masseater repositories that should be merged or recorded as intentional, using fallow similar-code. Use when running the similar code check of the daily audit.
---

# check-similar-code

## Why this skill exists and the state it aims for

This skill exists because copied code is rejected by verify, but similar code cannot be: two functions may be alike on purpose, and a gate that rejects them forces people to bend the code or disable the gate. The state it aims for is that every similar-code candidate has a decision, either merged or recorded as intentional with a reason.

## Rules

- Change nothing. Return the merges and verdicts as concrete changes for the owner.
- Follow the similar-code step of the repeated-corrections sweep that the hub points to for each repository: candidates come from `fallow similar-code`, each is read with `inspect`, and verdicts live in `similar-code-verdicts.json` at the repository root.
- For each candidate without a verdict, decide. Two functions doing the same thing are merged. An intentional similarity gets a verdict with `candidate_id`, `review_key` and the reason.
- End the instruction with a rerun of `review --require-verdict-for-each-candidate` after the change, and drop verdicts whose candidate no longer exists.
