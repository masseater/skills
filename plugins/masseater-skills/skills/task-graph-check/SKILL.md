---
name: task-graph-check
description: Bring the task graph file (status-view/graph.json in the project files) in line with the live thread list. Use when the hourly task-graph check scheduled task fires or the owner asks whether the task graph is current.
---

# task-graph-check

## Why this skill exists and the state it aims for

This skill exists because the task graph page is the owner's only at-a-glance view of what is running, and it shows only what `graph.json` holds. Threads start, finish and wait on the owner all the time, so a file that is not rewritten drifts from the thread list within the hour. A check that only reports the drift sends the same finding to the coordinator every hour and turns the coordinator into the one who must fix it, which is the cost this skill removes: the check repairs the file itself, and the coordinator hears only about what the check could not repair.

The state this skill aims for is that every unresolved thread of the project appears in exactly one task of `graph.json`, every task states what its threads are doing now, and `generatedAt` is the time of the last check.

## Rules

- The information sources are `/mnt/project-files/status-view/graph.json`, its contract in `/mnt/project-files/status-view/README.md`, and the project's thread list. Do not read resolved threads. Read an unresolved thread only as far as one line of `now`, `ask` or `result` needs.
- Read `graph.json` again immediately before you overwrite it, because the coordinator and other threads write it too. Change only the tasks you repair and overwrite the whole file once.
- A stale file means one of these: `generatedAt` is more than 90 minutes old, a working, blocked or review_ready thread is in no task's `threads[]`, or a `run` or `you` task lists only resolved threads.
- Repair a missing thread by adding it to the task that already does the same work, or by adding a new task with a goal from `goals[]`, a title that says what is achieved in plain Japanese, a `status` from the contract, and `updatedAt`. A thread that waits on the owner makes its task `you` with `ask` in one line.
- Repair a `run` or `you` task whose threads are all resolved by setting it to `done`, replacing `now` or `ask` with a one-line `result`, and setting `updatedAt`. A resolved thread whose task still has an unresolved thread stays listed.
- Drop a `done` task whose `updatedAt` is over 24 hours old. Do not change a task that is current.
- Write every line in English and translate it with PLaMo, fixing only clear mistranslations. Set `generatedAt` to the time of the write, even when nothing else changed.
- Do not report a repaired difference to the coordinator.
- The `masseater-skills` hook already adds a task when a thread posts its first progress checklist and closes it when the last thread of the task is resolved, marking each resolved thread with `resolvedAt`. It cannot choose the goal (it uses `g-ops`), merge threads into one task, set `you`, `wait` or `prs`, or notice a thread that the coordinator or the owner resolved. Repair those: move a new task to its goal, merge tasks that do the same work, and close a task whose threads are all resolved even when `resolvedAt` is missing.

## Finished state

- `graph.json` holds every unresolved thread of the project in one task, no `run` or `you` task lists only resolved threads, and `generatedAt` is the time of this run.
- Nothing is sent to the coordinator when everything was repaired. The last message of the run's thread is one line saying what was added or closed, or that everything was current, with the `generatedAt` that was written.
- When `graph.json` or the thread list could not be read or written, one line naming the source and the reason is sent to the coordinator.
- A difference that the contract does not let you place, such as a thread that fits no goal, is sent to the coordinator as one line naming the thread, and is the only thing sent.
- The thread is resolved.
