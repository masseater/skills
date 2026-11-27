---
name: cross-repo-similar-code
description: Find similar functions that sit in different masseater repositories with fallow similar-code, and turn each pair into a consolidation request. Use when the cross-repo similar code run fires or the owner asks whether code is duplicated across repositories.
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
- Send the requests to the owning threads through `message_coordinator`, never to a thread directly. Requests that have no owner go together as one request for a single new thread.
- Public output (a public repository, a pull request on one, a commit message) refers to a private repository by its repository ID and never by name. A report to the coordinator may use names.
- Write the report in Japanese, under 2000 characters, listing each pair as `repository/path:function` on both sides with its similarity. If nothing is found and the run was complete, write one line. Put the same text in this thread and in the message to the coordinator.
- Before anything else, list the project's threads. If another thread titled `横断類似コード` is neither resolved nor finished, the previous run is still going: do nothing, resolve this thread and stop. Resolve this thread when the report is sent.
