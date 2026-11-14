---
name: debug-like-a-human
description: AI gets into post-login screens and production behind Access through the same authentication path as the owner, and checks things itself. Use when building screens, APIs or sites with a login, when investigating production bugs, and when you are about to write "I can't check because it needs the owner's authentication".
---

# debug-like-a-human

## Why this skill is needed and the state it should achieve

This skill is needed because authentication assumes a human's device and session. An AI session has no means of getting in, so it either stops with "I can't because it needs the owner's authentication" or fills the gap with the pre-login screen or stubs, and post-login bugs are not found until the owner touches them.

The state this skill should achieve is that AI can get into every path humans use through the same authentication path as the owner, and check things itself. The owner's manual work is reduced to a single initial consent.

## Rules

- Where the owner's authentication is required, prepare on the AI side a mechanism that goes through the same path as the owner's authentication, and get in. Do not stop at "I can't because it needs the owner's authentication"
- Build that mechanism before the features that have authentication
- Do not get in by removing authentication. Bypass policies, service tokens and test login endpoints placed in production do not go through the real path
- Reproduce production bugs by doing the same post-login operation in production yourself before asking the owner

## Mechanisms to prepare

- Behind Access: enable Managed OAuth and add the host to `infra/repositories/access-sites.ts` in masseater.dev. Once the owner logs in at `https://credentials.masseater.dev/access-oauth/login?site=<host>`, you can get in by attaching the token from sundries' `get_access_token` with `Authorization: Bearer`, only to requests to that host. Do not enable Managed OAuth for apps that have their own OAuth
- Passkeys: make the virtual authenticator of Playwright's `browserContext.credentials` the AI's passkey, and go through the app's real registration and login paths. In production, register the AI's passkey with the owner's consent, and keep the key encrypted in the broker
