---
name: cross-repo-similar-code
description: Find similar functions that sit in different masseater repositories with fallow similar-code, and return each pair as a consolidation request. Use when running the cross-repo similar code check of the daily audit or when the owner asks whether code is duplicated across repositories.
---

# cross-repo-similar-code

## Why this skill exists and the state it aims for

This skill exists because the gate of a repository can only see that repository. When code lives in several repositories, the same missing abstraction can sit in two of them and nothing reports it, so a split that was drawn in the wrong place stays unnoticed until the copies have drifted apart. `fallow similar-code` analyzes one root per run and caps a run at about 1,400 functions, so pointing it at one repository at a time cannot find this, and one run over everything covers only a fraction of the code without saying so.

The state this skill aims for is that every pair of similar functions in different repositories is either merged into one abstraction or has a request to merge it, that a run which did not finish is reported as unfinished and never as clean, and that no verdict file exists anywhere.

## Rules

- Check out every repository as a real directory under one parent, at the latest `main`. Symlinked repositories are silently skipped by fallow, so a link gives an empty result that looks clean. List the repositories the way the daily check does: the owner's non-archived, non-fork repositories that point at the repo conventions, private ones included.
- Run `usecases/sweep.md`. It shards the run until every part is compared in full, because a part that hit a limit would hide pairs.
- When the result says `complete: false`, start the report with the unfinished parts (`failedPhases`, `unresolved`) and say that the rest is not a clean result. Never report a partial run as clean.
- Only pairs whose two sides are in different repositories belong here. Pairs inside one repository are the repository's own similar-code sweep.
- For each pair, read both functions, name the missing abstraction, and say where it belongs and what API fits both callers. A pair at similarity 1 is a copy: one side is deleted and imports the other. Do not propose a verdict and do not call a similarity intentional. If where the abstraction belongs is unclear, report the pair to the coordinator with the facts and draw no conclusion.
- Change nothing. Return the pairs as concrete consolidation requests for the owner; the daily audit routes them to the owning threads and writes the report.
- Public output (a public repository, a pull request on one, a commit message, a public CI log) refers to a private repository by its repository ID and never by name, and the run never happens in public CI, because its logs and artifacts would expose private code. A report to the coordinator may use names.

## ユースケース

- [`sweep`](usecases/sweep.md). Run fallow similar-code over every checked-out repository and return the pairs that cross repositories.
