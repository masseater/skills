---
name: daily-check
description: Audit every masseater repository for the problems no single repository's gate catches (Cloudflare cost, CI duration, expired upstream exits, similar code, repeated corrections, convention drift) and route each finding to the thread that can fix it. Use when the daily check scheduled task fires or the owner asks for the daily check.
---

# daily-check

## Why this skill exists and the state it aims for

This skill exists because the problems that matter most across the repositories are the ones no repository's own gate sees: spend drifting up, CI getting slow, an upstream patch that is no longer needed, near-duplicate code, a correction the owner already made once, a convention that drifted. Every repository passes its gate while these pile up, because no thread owns them and the owner would otherwise have to notice and say the same thing again. An audit that also edits what it finds has the opposite failure: it collides with threads already working in the same files and lands changes on judgments it was unsure about.

The state this skill aims for is that every finding reaches the thread that can act on it with a concrete fix, anything the audit is unsure about reaches the coordinator immediately, and the owner reads one short report a day.

## Rules

- Run the checks in this order, each with its usecase: [`cloudflare-cost`](usecases/cloudflare-cost.md), [`ci-duration`](usecases/ci-duration.md), [`msch-exits`](usecases/msch-exits.md), [`similar-code`](usecases/similar-code.md), [`repeated-corrections`](usecases/repeated-corrections.md), [`repo-conventions-review`](usecases/repo-conventions-review.md). The skills for each check are the ones the hub names for that situation; load them before starting the check, because the criteria live there and a copy here would drift.
- Before anything else, list the project's threads. If another thread titled `日次監査` is neither resolved nor finished, the previous run is still going: do nothing, resolve this thread and stop. Two runs would send the same findings twice.
- Start from the repositories that exist now: list the owner's non-archived, non-fork repositories and keep the ones whose AGENTS.md or CLAUDE.md points at the repo conventions; add any that are missing from the session. A fixed list goes stale the day a repository is added.
- Change nothing: no commits, no pull requests. A finding is fixed by the thread that owns the files and already holds the context, so an audit that edits collides with it.
- Route each finding to its owner: find the owning thread in the thread list and send the concrete fix through `message_coordinator`. Never message another thread directly, because the coordinator batches and tracks them. Send the findings that have no owner together, as one request for a single new thread, so the day produces one thread and not one per finding.
- Report unsure or unmanageable findings to the coordinator on the spot, with the facts and the point of doubt, and draw no conclusion. A confident wrong conclusion costs more than one extra message.
- Keep spend inside what the Workers Paid plan includes, judged across the whole account (other repositories such as mirucord share it). Anything that would add more than $0.10 a day beyond the free or included usage needs the owner's approval, and the finding says so.
- Write the report in Japanese, because the owner reads Japanese. Keep it under 2000 characters, use the check names as headings, include only the checks that found something, and put the same text in this thread and in the message to the coordinator. If every check is empty, write one line. Do not use Python anywhere.
- When the report is sent, resolve this thread, so the next day's guard does not see a stale run.
