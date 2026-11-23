---
name: daily-check
description: Run the daily audit of every masseater repository by reading and running a fixed list of check skills in order, routing findings to the threads that own them. Use when the daily check scheduled task fires or the owner asks for the daily check.
---

# daily-check

## Why this skill exists and the state it aims for

This skill exists because the problems that matter most across the repositories are the ones no repository's own gate sees, and they pile up unowned: the owner would otherwise have to notice and say the same thing again. Putting every check in one run without a shared way to report means findings collide with threads already working in the same files, or land as changes on judgments the run was unsure about.

The state this skill aims for is that every finding reaches the thread that can act on it with a concrete fix, anything uncertain reaches the coordinator immediately, and the owner reads one short report a day.

## Rules

- Read the skills the hub lists for the daily check and run each in the order given. The criteria live in those skills; a copy here would drift.
- Before anything else, list the project's threads. If another thread titled `日次監査` is neither resolved nor finished, the previous run is still going: do nothing, resolve this thread and stop. Two runs would send the same findings twice.
- Start from the repositories that exist now: list the owner's non-archived, non-fork repositories and keep the ones whose AGENTS.md or CLAUDE.md points at the repo conventions; add any that are missing from the session. A fixed list goes stale the day a repository is added.
- Route each finding to its owner: find the owning thread in the thread list and send the concrete fix through `message_coordinator`. Never message another thread directly, because the coordinator batches and tracks them. Send the findings that have no owner together, as one request for a single new thread, so the day produces one thread and not one per finding.
- Report unsure or unmanageable findings to the coordinator on the spot, with the facts and the point of doubt, and draw no conclusion. A confident wrong conclusion costs more than one extra message.
- Write the report in Japanese, because the owner reads Japanese. Keep it under 2000 characters, use the check names as headings, include only the checks that found something, and put the same text in this thread and in the message to the coordinator. If every check is empty, write one line. Do not use Python anywhere.
- Resolve this thread when the report is sent and every pull request the run opened is merged or closed, so the next day's guard does not see a stale run.
