---
name: push-idle-threads
description: Ask every idle thread of the project why it is idle and push it to continue or finish. Use when a request says that the periodic idle-thread check fired.
---

# push-idle-threads

## Why this skill exists and the state it aims for

This skill exists because a thread session wakes only when an event reaches it, such as a message, a pull request event or a scheduled reminder. A thread that ends its turn while work remains, with nothing subscribed and nothing scheduled, never wakes again, and nobody sees it stop: it keeps the review-ready or working label while no one works on it. The owner does not read progress, so a stalled thread costs the owner time only when the result fails to arrive.

The state this skill aims for is that every unresolved thread is in exactly one of three conditions: working, waiting on the owner, or waiting on an event that will wake it. A thread with nothing left is resolved.

## Rules

- The only trigger is the request that says the idle-thread check fired and gives `idleSince`. Do not poll and do not add a scheduled task. If several such requests arrive together, do one pass.
- A thread is idle when it is unresolved, has no activity since `idleSince`, and is not waiting on the owner. Leave threads that wait on the owner alone, and do not send the owner a reminder about them.
- Read the thread's last messages before asking. Skip it when it already answered a previous check with a wait that still holds: an owner decision, a subscribed pull request event, or a scheduled reminder.
- Ask each idle thread once per pass through `message_thread`: why it is idle, then either continue the work, or resolve itself when nothing is left. A thread that waits for an event must say which event and make sure something wakes it (a pull request subscription, a scheduled reminder, or a stacked pull request instead of waiting for another pull request).
- Do not resolve another thread's work yourself, and do not close its pull requests.
- Do not report the pass to the owner.
