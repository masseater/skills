---
name: check-monkey-test
description: Find crashes, hangs and uncaught errors that only random input exposes, from the daily monkey-test run in masseater.dev, and cover the owner-only sites that CI cannot reach. Use when running the monkey test check of the daily audit.
---

# check-monkey-test

## Why this skill exists and the state it aims for

This skill exists because the failures that random input finds, such as a published CLI that dies on a file with invalid bytes, a page that throws after a burst of clicks, or a form that returns a server error on a garbage string, appear only when someone does something no test author imagined. Verify never does it, and a model asked to try "a few odd inputs" tries the same few every time and judges what it sees differently each day. A run that depends on that judgment finds nothing the next day.

The state it aims for is that the same random input is replayed from a seed, every failure is a line a program printed and not an opinion, and each failure reaches the thread that owns the app within a day.

## Rules

- Change nothing. Return findings as concrete fixes for the owner.
- The run lives in `tools/monkey-test` of masseater.dev as the `daily` task of the workspace, so `daily.yml` runs it with the other daily jobs. It lists the targets by itself: the owner's published npm packages with a bin, the custom domains of the Cloudflare account that answer with a public HTML page, and the sites whose Access token it is given. Do not keep or pass a list of targets in this skill, because a fixed list goes stale the day an app is added.
- Read the latest run of `daily.yml` in masseater.dev and its `monkey-test` job through the GitHub MCP tools; cloud sessions get 403 from the GitHub API directly. Collect each line of the form `monkey.finding <kind> <target> <detail>`. The last line `monkey.done seed=<n> findings=<n>` gives the seed; the same seed replays the same input. The job fails while any finding exists, so a red job is the signal and the lines are the content.
- CI has no way to pass an Access token, so the sites behind Access are covered here. In a cloud session, get a token for each Access site through the portal `get_access_token` tools, then run `node bin/monkey-test.ts` in `tools/monkey-test` with `MONKEY_ACCESS_TOKENS` set to a JSON object that maps each host to its token. Never write a token to a file, a log, a pull request or the report. The run sends only GET and HEAD requests and aborts anything else, so it changes nothing on the site.
- Route each finding like the rest of the daily audit. Tell the owning thread the kind, the target, the seed and the detail, and ask it to fix the cause; a finding on a published package goes to the thread that owns that package, and one on a site to the thread that owns the site. Do not ask anyone to silence a finding, to skip a page or to catch an error without handling it. Send findings with no owner together as one request for a single new thread.
- A finding that disappears on a re-run with the same seed is still a finding, because the input was the same and the app is not deterministic; report it with that fact.
- Report a check that could not run first: the `monkey-test` job missing or cancelled, an Access token that could not be obtained, or the install of a package that failed. A silent gap looks the same as a clean run.
