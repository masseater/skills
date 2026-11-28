---
name: check-skill-rules
description: Find rules written in masseater's skills that a msch check could decide mechanically, and ask for the check and for removing the sentences it replaces. Use when running the skill rules check of the daily audit.
---

# check-skill-rules

## Why this skill exists and the state it aims for

This skill exists because a rule written only in a skill holds only while a model reads it and recalls it at the moment it applies. The model reads the skill once, the rule competes with every other sentence for attention, and a violation passes every gate because nothing but the text knows the rule. Every such sentence is also read in every session that loads the skill, so skills grow longer while enforcing less. A check decides the same rule every time and states the fix at the moment it applies.

The state it aims for is that every rule in a skill that a machine can decide lives in msch, and the skills keep only what needs judgment.

## Rules

- Change nothing. Return findings as concrete fixes for the owner.
- Read every skill that the masseater repositories author: `SKILL.md`, `usecases/` and `references/`. Read an installed copy under `.agents/skills/` or `.claude/skills/` at its source instead, so the finding names the file to change.
- Start from the sentences, not from code: a rule a machine can decide is a finding even when no repository breaks it today.
- A rule is decidable when the repository's files, configuration or commit messages always give the same verdict without judgment, for example a forbidden file, key, value, word, dependency or command, a required field or section, or a value that must match another. Leave out rules about what an agent does during a session and rules that need judgment, and do not list them, because a report of what cannot be checked asks the owner to read it for nothing.
- Before calling a rule already enforced, find the msch rule or repository test that decides it and the test case that covers it. A similar name is not coverage. For an enforced rule, ask only for removing the sentences.
- For a rule nothing decides yet, ask for a msch check with tests in masseater/ecosystems: what it reads, which repositories it applies to, and a message that names the fix and carries the rule's reason, because the message replaces the sentence.
- Send the msch check and the text change as one finding to the thread that owns msch, with the skill file and line, the quoted rule, and the sentences to remove or shorten. The text changes only after the msch release that enforces the rule reaches the repository holding the skill, so there is never a day when neither the skill nor a check holds the rule.
- Ask for removing or shortening only the sentences the check covers, and leave every other sentence as it is, even when it reads poorly. Rewriting a skill as a whole, for structure or for its Japanese, is beyond what this check does reliably.
- Keep a sentence whose violation does harm before any check runs, such as publishing, deleting or spending a paid quota, even when a check is added. A check after the fact does not undo it.
- Skip a rule for which this run or an open pull request in masseater/ecosystems already asks for a check.
