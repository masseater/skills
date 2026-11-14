---
name: project-checklist
description: Judge, by checking the real thing, whether the items to consider in a project's design are satisfied. For repositories created from masseater/typescript-template, it also covers the GitHub settings and migration to the template. Use when creating a new repository, after leaving a migration to AI, before large changes, and when reviewing an existing project.
---

# project-checklist

- For each item, check the current state and judge by comparing it with the condition for being satisfied
- Attach to each verdict the place you checked and the result
- Make each verdict one of "satisfied", "insufficient", "unchecked" or "not applicable"
- Do not fix anything while judging. Hand over the insufficiencies as a list. If you judge while fixing, the verdict is replaced by the result of the fix

## Why this skill is needed and the state it should achieve

This skill is needed because many of the items to consider in design let the project run even without being considered. If nobody decides, the default becomes the answer as it is, and the build and tests pass, so nobody notices what has not been decided. The problems are found after publication, as bills or information leaks.

The state this skill should achieve is that for every item to consider in design, the current state of the project can be explained with grounds from the real thing.

## How to judge

- Check the current state in this order: production, the build output, the repository's files. The closer something is to production, the more it represents fact rather than intention. Follow measure-dont-guess for how to check in production
- Do not make a verdict "satisfied" just because a policy or setting is written down. Even when written, it may not be working
- Judge items determined by numbers with measured numbers
- If the target project's AGENTS.md or CLAUDE.md has rules, make them the conditions for being satisfied. Decisions made in that project take precedence over general standards
- Mark items you could not check as "unchecked", and write why you could not check them. If you fill them in by guessing, unchecked content becomes indistinguishable from checked content
- Mark items that do not apply as "not applicable", and write a reason that can be stated from the real project. Treat not-applicable items whose reason cannot be written as insufficient
- Treat signs that checks or lint were loosened to make things pass as insufficient in themselves. Deleting tasks, loosening severity or ignorePatterns, and an increase in suppression comments fall under this. Checks that may have been loosened cannot be used as grounds for other verdicts

## Items

Read all of the following too.

- [`requirements`](references/requirements.md). Users and purpose, and expected scale
- [`access`](references/access.md). Visibility of each page and API, and authentication and authorization
- [`rendering`](references/rendering.md). Rendering method of each page
- [`data`](references/data.md). Where data is stored, how the schema is changed, and caching
- [`security`](references/security.md). Secrets, vulnerabilities in dependency packages, response headers, dynamic scanning and rate limiting
- [`cost`](references/cost.md). Charges incurred by one visit, caps when things run away, and the actual billed amount
- [`performance`](references/performance.md). Web Vitals and server response time
- [`search-and-sharing`](references/search-and-sharing.md). Listing in search engines, the content of listed pages, and how it looks when shared on social media
- [`accessibility`](references/accessibility.md). Violations found by automated checks, and keyboard operation
- [`observability`](references/observability.md). Tracing production requests, measurement, and failure detection
- [`reliability`](references/reliability.md). Data recovery, recreating resources, and failures of external calls
- [`delivery`](references/delivery.md). The CI and deployment path, rollback, and environment variables
- [`dependencies`](references/dependencies.md). Choice and licenses of dependency packages, third-party materials, and the Node.js version
- [`privacy`](references/privacy.md). The personal information collected, and its deletion
- [`publishing`](references/publishing.md). The list of what is published, URL changes, and the takedown procedure
- [`testing`](references/testing.md). How each mechanism is checked, and production code that exists only for tests

In repositories created from masseater/typescript-template, also read the following.

- [`typescript-template`](references/typescript-template.md). Whether the template's skeleton is introduced and working, and no old structure remains

## Use cases

Read the following.

- [`check`](usecases/check.md). Check and judge the current state of a project
- [`setup`](usecases/setup.md). Align with gh the GitHub-side settings of a repository created from the template
