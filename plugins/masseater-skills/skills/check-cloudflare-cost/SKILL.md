---
name: check-cloudflare-cost
description: Find designs that raise the Cloudflare bill and metered usage with no cap across all masseater repositories, using production usage as well as code. Use when running the Cloudflare cost check of the daily audit.
---

# check-cloudflare-cost

## Why this skill exists and the state it aims for

This skill exists because Cloudflare cost is set by production behavior, not by code review: a loop, a retry or an uncapped model call looks harmless in a diff and becomes the bill days later, and no repository's gate sees usage. The state it aims for is that total usage stays within what the Workers Paid plan includes, judged across the whole account because the repositories share it, and every source that can exceed it is either capped in infrastructure as code or reported.

## Rules

- Change nothing. Return findings as concrete fixes for the thread that owns the files, so the audit never collides with work in progress.
- Check production usage, not only code and configuration: the GraphQL Analytics API for Workers, Durable Objects, D1, Queues and the rest, and the AI Gateway logs for Workers AI.
- Judge the totals against the Workers Paid included usage for the whole account, other repositories such as mirucord included.
- Report each pay-as-you-go source that has no cap in infrastructure as code, and each design that raises cost.
- For anything that adds more than $0.10 a day beyond the free or included usage, state that the owner must approve it.
- When a violation can be detected mechanically, add a proposal to put it into a msch check, so every repository receives it.
