---
name: push-idle-threads
description: Ask every idle thread of the project why it is idle and push it to continue or finish. Use when the periodic idle-thread check wakes the coordinator session.
---

# push-idle-threads

## Why this skill exists and the state it aims for

This skill exists because a thread session wakes only when an event reaches it, such as a message, a pull request event or a scheduled reminder. A thread that ends its turn while work remains, with nothing subscribed and nothing scheduled, never wakes again, and nobody sees it stop: it keeps the review-ready or working label while no one works on it. The owner does not read progress, so a stalled thread costs the owner time only when the result fails to arrive.

The state this skill aims for is that every unresolved thread is in exactly one of three conditions: working, waiting on the owner, or waiting on an event that will wake it. A thread with nothing left is resolved.

## Rules

- The only trigger is the scheduled task that wakes the coordinator session with the idle-thread check. Do not poll, do not add another scheduled task, and do not route the check through the external request queue, which starts an empty relay thread for every request. If several wakes arrive together, do one pass.
- A thread is idle when it is unresolved, has had no activity since the previous pass began, and is not waiting on the owner. Leave threads that wait on the owner alone, and do not send the owner a reminder about them.
- Read the thread's last messages before asking. Skip it when it already answered a previous check with a wait that still holds: an owner decision, a subscribed pull request event, or a scheduled reminder.
- Ask each idle thread once per pass through `message_thread`: why it is idle, then either continue the work, or resolve itself when nothing is left. A thread that waits for an event must say which event and make sure something wakes it (a pull request subscription, a scheduled reminder, or a stacked pull request instead of waiting for another pull request).
- Do not resolve another thread's work yourself, and do not close its pull requests.
- Do not report the pass to the owner.
