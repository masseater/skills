---
name: cloudflare-caution
description: Avoid designs that inflate the bill on Cloudflare, and choose the shape that stays cheap. Use when designing something to put on Cloudflare, when adding Workers or bindings, when deciding how to serve pages and data, and when writing loops or retries.
metadata:
  derived-from: https://github.com/anantbhandarkar/make-it-right/blob/1e20457d47d6cf4658b131c29204a9a4d1c1d91d/skills/mir-cloud-cloudflare/SKILL.md
---

# cloudflare-caution

- Do not run processing whose result is the same on every request
- Put mechanisms in code and configuration that stop things when they run away
- Estimate costs in billed units, and confirm with production usage

## Why this skill is needed and the state it should achieve

This skill is needed because Cloudflare bills by usage in fine-grained units, with no cap on spending. Each unit is cheap, so it does not bother you while writing, but for processing that runs on every view, and for loop and retry bugs, the number of runs becomes the bill as it is.

The state this skill should achieve is that the cost of one visit is decided at the design stage. Even when bugs or bots go beyond expectations, code and configuration stop it before it becomes a bill.

## Prebuilding what gives the same result

If you rebuild the same thing on every view, Worker invocations, CPU time and DB rows are billed in proportion to the number of visits. Prebuild and serve whatever can be prebuilt.

- For how to serve public pages that are the same for everyone, follow project-checklist
- Using CSP nonces means building the HTML per request. For public static pages, do not rely on nonces; move inline scripts into external files and attach a CSP common to all pages with `_headers`. Listing per-page hashes in `_headers` will eventually break down at the rule limit (100)
- Requests matching static assets are by default [served without invoking a Worker](https://developers.cloudflare.com/workers/static-assets/), so they are not billed. If the compatibility flag `assets_navigation_prefers_asset_serving` (default with compatibility dates from 2025-04-01) is enabled, the navigation fallback does not invoke a Worker either
- Narrow `assets.run_worker_first` to just the authentication and API paths with an array. Setting it to `true` turns every request for static assets into Worker billing as well
- Make only the parts that change per viewer dynamic. Do not make the whole page dynamic
- Put dynamic data in the CDN cache, the Cache API or KV according to how often it changes. Do not call D1 or external APIs on every request
- On the client, do not refetch while the data does not change. With TanStack Query, set `staleTime`

## Brakes for runaways

- Give Workers `limits.cpu_ms` from [Custom limits](https://developers.cloudflare.com/workers/platform/pricing/). This is the only official means of stopping a single execution from running away. Measure the p99 of production CPU time and set the value a little above it. If you raise it to the maximum, an infinite loop becomes the bill as it is
- Put rate limiting in front of public APIs, authentication and write endpoints. Without rate limiting, every mass access by bots is billed
- Apply rate limiting with WAF rate limiting rules in repositories that own the zone, and with the Workers [Rate Limiting binding](https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/) in repositories that do not. The binding is an approximation per location and may not stop even when the limit is exceeded. When an exact limit is needed, use WAF rate limiting rules or a Durable Object counter
- Make Queue consumers, Durable Object alarms and retry processing idempotent. Do not re-enqueue yourself
- Put a cap on the number of re-enqueues and retries
- Set [budget alerts](https://developers.cloudflare.com/billing/manage/optimize-costs/) on the account. They are not for stopping things but for noticing early

## Reducing writes and operations

Write and list operations cost one to three orders of magnitude more than reads.

- Batch KV writes and row writes to D1 and Durable Objects
- Do not write if the value has not changed
- Do not call KV `list()` on every request. Design so that values can be looked up directly by key
- Let Durable Objects sleep with WebSocket Hibernation and alarms. While awake, 128 MB worth of time is billed even if unused
- Do not keep a Durable Object awake with `setTimeout` or outbound connections
- Do not use R2 Infrequent Access for small files with many writes or reads. Its per-operation price is higher than Standard

## Thinning logs and traces

Both logs and traces are billed by volume.

- Do not keep storing logs of every request in Cloudflare. Sample only the amount you need with `head_sampling_rate`
- If you only send them externally, set `persist: false`

## Estimating and confirming in production

Follow measure-dont-guess.

- Before deciding the design, estimate the monthly cost by multiplying the expected number of visits by the number of Worker invocations, rows, operations and logs per visit
- After deploying, look at production usage with Billable Usage on the dashboard or the GraphQL Analytics API. If it diverges from the estimate, revisit the design

The billing units and unit prices are as follows. They were confirmed on 2026-10-27 on the [Workers pricing page](https://developers.cloudflare.com/workers/platform/pricing/) and elsewhere. Unit prices change, so confirm them on the pricing pages before using them in an estimate.

| Target | Billing unit | Included amount on Paid and overage |
| --- | --- | --- |
| Workers | Requests and CPU time | 10 million requests per month, overage $0.30 per million. CPU 30 million ms per month, overage $0.02 per million ms |
| Static assets | Not billed | Free as long as no Worker is invoked |
| KV | Reads, writes, deletes, list | Reads $0.50 per million; writes, deletes and list $5.00 per million |
| D1 | Rows read and rows written | Writes 50 million rows per month, overage $1.00 per million rows. Reads $0.001 per million rows |
| Durable Objects | Requests, time awake (GB-seconds), rows | Time is billed for 128 MB regardless of usage. Not billed while sleeping |
| Queues | Operations | Splitting into 64 KB chunks and retries each count as one operation |
| R2 | Class A and Class B operations and storage | Egress is free. Multipart uploads are Class A per part |
| Workers Logs | Log events | From 2026-12-01 changes to [Cloudflare Observability pricing](https://developers.cloudflare.com/observability/pricing/) (ingested GB and stored GB-months) |
| Workers Logpush | Requests | 10 million per month, overage $0.05 per million |
