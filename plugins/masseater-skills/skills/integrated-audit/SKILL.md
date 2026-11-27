---
name: integrated-audit
description: Review the project's threads, the daily audit report and the recently merged pull requests as a whole on Opus, to find wrong conclusions, partial fixes and conflicts between threads. Use when the Opus integrated audit scheduled task fires or the owner asks for an integrated audit.
---

# integrated-audit

## Why this skill exists and the state it aims for

This skill exists because the threads run on a cheaper model and each sees only its own task. A thread can reach a wrong conclusion that sounds right, fix one place so that it now behaves differently from its siblings, or collide with another thread, and no single thread has the view to notice. The hourly patrol lists state and the daily audit checks the repositories, so neither judges the quality of the work itself.

The state this skill aims for is that the work done across threads is judged as one whole by a stronger model: wrong conclusions are caught, partial fixes are completed everywhere, and conflicting work is reconciled, without repeating what the patrol and the daily audit already cover.

## Rules

- If the current model is not claude-opus-5-5, switch to it first with `switch_model`. The owner asked for this audit to run on Opus while the threads run on Sonnet, and the review is only worth its cost on the stronger model.
- Before anything else, list the project's threads. If another thread whose title contains `統合監査` is neither resolved nor finished, the previous run is still going: do nothing, resolve this thread and stop.
- Read only four things: what the hourly patrol thread posted since the previous audit, the latest report of the thread titled `日次監査`, the latest report of the thread titled `横断類似コード`, and the pull requests merged since the previous audit across all of the owner's repositories, masseater.dev first. Listing thread states and repeating the daily checks are the other two audits' work, so repeating them only adds noise.
- A cross-repo similar-code run takes too long and needs the local model, so this audit never runs it. If the latest `横断類似コード` report is more than a day old, or there is none, add to the message to the coordinator a request for one new thread that runs the cross-repo similar-code check. If its report lists a pair that no thread owns, route that pair like any other finding.
- From those, look at the work as a whole: whether Sonnet's work fixed the root cause, was verified, and followed the rules and skills; conclusions that are wrong; a fix that makes only the fixed place behave differently from the rest; inconsistency, duplication or conflict between threads; the health of main; and stalls the patrol missed.
- Write no code. Turn each thing to fix into a concrete instruction for its owning thread and send it, with what you found, to the coordinator through `message_coordinator` in Japanese under 2000 characters. Never message another thread directly. Ask for a new thread for work that has no owner.
- Post the same text in this thread. If nothing is wrong, one line is enough. If a source could not be read, start the text with that source and the reason, because a silent gap looks the same as a clean audit.
- Resolve this thread when done, so the next run's guard does not see a stale run.
