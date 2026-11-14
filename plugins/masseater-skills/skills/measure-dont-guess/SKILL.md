---
name: measure-dont-guess
description: Decide, before implementing or fixing, on a measurement that settles a hypothesis one way or the other, run it, and judge only by its result. Use when investigating the cause of a bug, when comparing performance or behavior, when starting to write a new feature, and when you are about to judge on a "probably".
---

# measure-dont-guess

- Before measuring, write the hypothesis and the values that would accept it
- Measure in production, or under the same conditions as production
- State explicitly that unmeasured claims are guesses
- When you cannot measure, do not proceed on guesses; tell the user what is missing

## Why this skill is needed and the state it should achieve

This skill is needed because guessing gives an answer faster than measuring, and it usually looks reasonable. A change made on a guess leaves no material for noticing that it is wrong.

The state this skill should achieve is that every judgment rests on grounds that anyone can reproduce.

## Measuring in production

Measurements used as grounds for judgment are done in production. Local and test environments differ in data scale and external services, and can lead to the opposite conclusion from production.

- When you cannot measure in production, build a staging environment and measure there
- Make staging the same as production in code, configuration, infrastructure, the scale and shape of data, and external services
- Use measurements in local and test environments only to confirm that the measuring mechanism works

## Recording measurements

- For measurements used as grounds for a change, write the conditions, commands and results in the commit message
- If an inconvenient result comes out, report it as it is and revisit the hypothesis

## Use cases

Read all of the following too.

- [`measure`](usecases/measure.md). Form hypotheses, measure, and decide by the results
- [`find-root-cause`](usecases/find-root-cause.md). Find the root cause of a bug
- [`improve-performance`](usecases/improve-performance.md). Improve performance

## References

In repositories created from masseater/typescript-template, also read [`typescript-template`](references/typescript-template.md). In other repositories, read it as the equivalent that plays the same role.
