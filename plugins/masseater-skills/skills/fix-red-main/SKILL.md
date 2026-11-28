---
name: fix-red-main
description: Bring the main branch of masseater.dev, ecosystems or ai-produced back to a green verify after the CI failure notice arrives, with one fix per failure. Use when a request says that a repository's main verify failed.
---

# fix-red-main

## Why this skill exists and the state it aims for

This skill exists because a red main blocks every merge behind it, and until now several actors fixed the same failure at once: a library update thread, a bot pull request from the autofix workflow, and a revert attempt. Two fixes for one failure collide, and a revert or downgrade only hides the cause until the next update brings it back. A timer that looks for red main every hour was added to catch what these missed, and it started a new thread every hour whether or not anything had failed.

The state this skill aims for is one path. The failed verify run on main tells the credential broker, the broker queues a request, and the request starts this skill. There is no timer. For each failure exactly one pull request fixes the cause, and main returns to green.

## Rules

- The only trigger is the request that says `<repository> の main の verify が失敗した` with the failed run URL. Do not poll for red main and do not add a scheduled task for it.
- Read the failed run, its failing jobs and their logs. The `verify` workflow runs on pushes to main and on a daily schedule. Pull request branches have no verify of their own, so never read them and never add a check that runs verify before a merge.
- Before opening anything, list the open pull requests and the project's threads, and look for one that fixes the same failure: the same failing job and message, or the same commit. If one exists, send it the run URL and the failing job through `message_coordinator`, and stop. Do not open a second fix and do not start a new thread. A failure that is already being fixed by a pull request younger than 60 minutes needs nothing more.
- Fix the cause. Never fix by reverting the commit, downgrading a dependency, turning a lint rule off, skipping a test, or adding an export or workaround that only silences a check. Design the proper API when a rule shows a bad abstraction.
- Open one pull request for the failure, and let the merge queue take it. If the pull request that should fix it is stuck (a conflict, a failed check, left the queue), remove the cause of the stall, and do not close a pull request that another thread opened. Tell its thread through `message_coordinator`.
- If you cannot fix it because it needs a permission, an outside change or an owner decision, send what blocks it and the one step the owner has to take to the coordinator through `message_coordinator`.
- End with one line per repository in the thread: green, being fixed by an existing pull request, fixed by a new pull request, or could not fix, each with the run URL and the pull request URL. If the run or its logs could not be read, start the line with what could not be read and why. Then resolve the thread.
