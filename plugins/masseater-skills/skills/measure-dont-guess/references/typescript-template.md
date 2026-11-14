# Measuring in typescript-template

## How to emit signals

Emit server signals with Effect's APIs, and collect them in Cloudflare Workers Observability.

- `apps/web/src/pages/home/api/tracing.server.ts` copies `Effect.withSpan` into Workers traces
- `Effect.log*` goes into Workers Logs
- Cloudflare automatically turns D1 and fetch calls into spans
- For metrics, use Workers' request count, error count, CPU time and duration
- The observability settings and sampling rate are in `observability` in `apps/web/alchemy.run.ts`

| Problem | What to emit |
| ------- | ------------ |
| Bug | Emit inputs and branches with `Effect.logInfo` with `Effect.annotateLogs`, look at the path with `Effect.withSpan`, and reproduce with a test |
| Slowness | Compare the duration of `Effect.withSpan` before and after the change, and compare the logic alone with `vp test bench` |
| New feature | In addition to acceptance tests, emit success and failure in logs with `Effect.annotateLogs`, and count them in Workers Logs |

## Samples

Logs and traces keep only some requests as samples.

- Raise the sampling rate only during measurement, and restore it afterward
- With a judgment, also state whether the number of samples is sufficient

## Where to query

- Query production logs, traces and metrics with the `cloudflare-observability` MCP server in `.mcp.json`
- Call other Cloudflare APIs with the `cloudflare-api` MCP server
- Both use the credentials of the Alchemy profile
- To stream the logs of a deployed Worker, use `vp exec alchemy logs --tail` in `apps/web`
- Effect logs and the browser console also appear in the terminal of `vp run dev`

## Browser

Operate it with `vp dlx @playwright/cli`, and observe with `console`, `requests` and `snapshot`. In cloud environments, write the Chromium in `/opt/pw-browsers` to `launchOptions.executablePath` in `.playwright/cli.config.json`.

If `alchemy dev` stops with `CredentialsUnavailable`, proceed with what can be measured with tests and logs. Tell the user that the screen has not been measured.
