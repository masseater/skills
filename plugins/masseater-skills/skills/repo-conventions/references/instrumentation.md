# Instrumentation

Follow measure-dont-guess for the procedure of deciding by measurement. This file holds the rules for making things measurable.

- Before feature development, build a mechanism that lets AI debug on its own. It has three parts: a means of reproduction, logs and spans, and a path to read them
- Make every operation that costs time or money a span. Requests to external APIs and models, child processes and file I/O fall under this
- On Cloudflare Workers, export Effect spans, TanStack Start requests and server functions, and Elysia routes to Workers traces with `@r_masseater/workers-tracing`
- For processes other than Workers, export with `OtlpTracer.layerFromConfig`. Effect sends only when `OTEL_TRACES_EXPORTER=otlp` and `OTEL_EXPORTER_OTLP_ENDPOINT` are set
- When checking in tests the spans, metrics and logs that code actually emitted, set up an OTLP receiver per test file with `@r_masseater/vitest-otlp`
- Put spans in the operation that actually takes the time. Do not wrap commands or processes just for measurement
- At the end of every GitHub Actions workflow, put a job that runs `.github/scripts/ci-telemetry.sh`

## Web Vitals

- Measure Web Vitals (LCP, INP, CLS, FCP, TTFB, TBT) by running `vp run measure <URL>...` in `tools/web-vitals`, which has `@r_masseater/web-vitals-flow` installed. It measures, five times with a Lighthouse user flow, the load of each URL and the navigation from clicking a same-origin link on that page, and writes flow-<run>.html and flow-<run>.json per run to `report/`. It fails if, by the median of each step, any of LCP, INP or CLS does not reach Lighthouse's passing score (0.9)
- main's verify measures production at `vars.ZAP_TARGET_URL` after deploying, and keeps the report as an Actions artifact
- In cloud sessions, add `--chrome-flags="--no-sandbox --proxy-server=$HTTPS_PROXY"`. The session-start hook passes Chrome via `CHROME_PATH`
