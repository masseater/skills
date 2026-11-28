---
name: check-private-terms
description: Find the owner's non-public affiliations and non-public activities written into public repositories, using a term list kept in the private repository. Use when running the private terms check of the daily audit.
---

# check-private-terms

## Why this skill exists and the state it aims for

This skill exists because the rule against putting non-public affiliations into public places is a sentence that a model obeys only when it happens to recall it. When it produces a test fixture, a README or an environment name, the model fills in the concrete name that sits in its context, and the leak lands in the history of a public repository, where only the owner would notice it. A check that finds the leak needs the list of terms, and that list is itself the non-public information, so the list and the public repositories have to stay apart.

The state it aims for is that no public place holds a non-public affiliation or activity of the owner, and that a leak is found within a day, before it is copied further.

## Rules

- Change nothing in the public repositories. Return findings as concrete fixes.
- Read the terms from `docs/private-terms.txt` in the private repository with repository ID 1403864815, from the session's clone or through the GitHub MCP tools. Each line is one extended regular expression; skip blank lines and lines starting with `#`. Never copy the file or a term into a public repository, a pull request, a commit message, a skill or a public CI log. Only this thread and the message to the coordinator may name a term.
- List the owner's non-archived, non-fork public repositories now; a fixed list goes stale the day a repository is added. Report a repository that could not be read, because a silent gap looks the same as a clean one.
- Scan with git, which needs no other tool. In a clone made with `git clone --filter=blob:none --no-single-branch`, with the terms written one per line to `patterns` and joined with `paste -sd'|' patterns`:
  - the tree of the default branch: `git grep -n -I -i -E -f patterns`
  - commit messages on every branch: `git log --all -i -E --since='3 days ago' --grep="$joined"`
  - added and removed lines on every branch: `git log --all -i -E --since='3 days ago' -G "$joined"`
  - titles and bodies of open pull requests and of issues updated in the last 3 days, read through the GitHub MCP tools and matched against the same patterns
- A match in the tree or in a pull request or issue is a leak to remove now. A match only in a commit from the last 3 days is a leak already in history: report it, and leave rewriting a public history to the owner's decision.
- Route each finding like the rest of the daily audit. Tell the owning thread the repository, the file and the line, or the commit or pull request, and ask it to replace the text with a generic description. It reads the match itself, and its commit message and pull request text must not contain the term either. Send findings with no owner together as one request for a single new thread.
- When the owner names a new non-public term, add one line to the list in the private repository.
