---
name: memory-tidy
description: Shorten and consolidate the project memory (MEMORY.md and its linked notes) without losing the owner's standing rules or their reasons. Use when the periodic memory-tidy scheduled task fires or the owner asks to tidy the memory.
---

# memory-tidy

## Why this skill exists and the state it aims for

This skill exists because project memory is read in full at the start of every thread, and every thread and every scheduled run appends to it. Entries pile up: the same rule is recorded twice in different words, finished work stays listed as open, and notes outgrow the size at which only their first part is recalled. A longer index costs every later session context and buries the rules that matter, and an agent that tidies carelessly does the opposite damage, because a rule the owner stated once is gone for good when it is dropped and the owner cannot tell it was lost.

The state this skill aims for is that the memory is as short as it can be while every standing rule the owner stated, and the reason the owner gave for it, can still be found. What remains describes the present, not the past.

## Rules

- Memory is written by many sessions at the same time. Read the index and each note immediately before changing it, change only what you tidy, and never write back a copy read earlier.
- Keep every standing rule and preference the owner stated, with its reason. Shorten the wording, never the content. When a rule has no recorded reason, keep it as it is.
- Merge entries that say the same thing into one, keeping the strictest version and every reason. Fix `[[links]]` that pointed to a merged or deleted note.
- Drop an item only when you have confirmed it is finished or no longer true, such as work whose pull request is merged or whose thread is resolved, or a claim the current state contradicts. When you cannot confirm it, keep it. Convert relative dates to absolute dates.
- Keep only what a later session cannot learn from the repositories, the task graph or the thread list. Do not keep progress logs or results of past work.
- Keep each note under 4 KB including the frontmatter, with a one-line description, because recall shows only the first 4 KB. Split or summarize a note that is larger.
- Do not add entries that the tidying itself does not need, and do not change the memory's structure or naming conventions.

## Finished state

- Every standing rule and reason found at the start is still findable.
- The index and notes contain no duplicates, no finished items listed as open, no links to notes that no longer exist and no note over 4 KB.
- The run's thread holds one line: the size of the index before and after, and what was merged or dropped. If nothing needed tidying, one line says so. If a file could not be read or written, the line starts with that file and the reason.
- The thread is resolved.
