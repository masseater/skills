---
name: check-repo-conventions
description: Compare every masseater repository with every viewpoint of the repo conventions and propose checks and refactors for what is not detected. Use when running the repo conventions check of the daily audit.
---

# check-repo-conventions

## Why this skill exists and the state it aims for

This skill exists because a repository can pass every warning and still be shaped wrongly: no warning asks for a slice that should exist or a layout that will not scale. The state it aims for is that every repository matches every viewpoint of the conventions, and what is not detected mechanically has either a check proposed for it or a refactor.

## Rules

- Change nothing. Return findings as concrete fixes for the owner.
- Compare code and structure with every viewpoint written in the conventions, not only layering and colocation, and do not stop at an absent warning.
- For violations no check detects, propose a msch check that would detect them in every repository.
- For violations that are hard to detect mechanically, propose the refactor: create the slice, regroup into a shape that scales, merge duplicated pieces.
- Conflicts with other threads touching the same files are not a reason to leave a finding out. Name the thread and send the finding there.
