# Repositories that deploy to Cloudflare

Follow cloudflare-caution for designs that keep costs down.

- Assume the Workers Paid plan. You may design on the premise of features and limits available only on Paid
- The zone's WAF custom rules and the Logpush job are owned only by masseater/masseater.dev, the owner of the masseater.dev zone. Other repositories do not own them and leave `OWNED_ZONE` as `Option.none()`. If two repositories own settings for the same zone, they overwrite each other's settings on every deploy
- Add `logpush: true` to every Worker
- Do not use Bot Fight Mode
- Manage authentication for clouds such as Cloudflare with Alchemy profiles
- Changing `APP_NAME` or the stack name recreates the resources

## Public static pages

Pages shown to everyone whose content does not change per request are built in the same shape as `apps/lp` in masseater/typescript-template.

- Turn them into HTML with TanStack Start's prerendering, and serve them as static assets only with `Website.StaticSite` without passing `main`. Do not use Worker SSR, `runWorkerFirst` or serving from R2
- Do not rely on nonces for CSP. The Vite plugin in `apps/lp/inline-scripts.ts` moves inline scripts into external files, and `STATIC_PAGE_HEADERS` from `security-headers` is attached with `_headers`

## Analytics

Enable Cloudflare Web Analytics by default.

- Create a site only once per host with the Cloudflare API, and put its token in `CF_BEACON_TOKEN` in `alchemy.run.ts`
- Do not use `Rum.Site`, so as not to add Account Settings Write to the CI token
- For SSR apps, `start.ts` adds the beacon to the HTML from the Worker's `CF_BEACON_TOKEN`. For static pages, it is inserted in the root `head` from `VITE_CF_BEACON_TOKEN` at build time. The zone's automatic injection does not apply to Workers responses
