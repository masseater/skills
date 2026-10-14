---
name: poteto-principles
description: 設計・実装・修正・リファクタリング・移行・文書の変更に取りかかるとき、とくに依頼や指摘を既存のものに継ぎ足して済ませそうなときに読む。cursor/plugins の pstack にある poteto の原則集で、該当する原則を references から読んで従う。
metadata:
  upstream: https://github.com/cursor/plugins/tree/c86f349b102feb91f1966f8a6a60882a4e601b50/pstack/skills
---

# poteto-principles

## 目的と達成したい状態

依頼や指摘を受けると、言われた箇所だけを継ぎ足して直し、全体の設計が目的からずれていく。

変更のたびに目的と全体を見直し、最初からその要件があったかのような形に作り直している。

## 原則

`references/` は pstack の `principle-*` の原文である。作業に当てはまる原則を読んで従う。どれにも迷ったら、まず [`redesign-from-first-principles`](references/redesign-from-first-principles.md) と [`subtract-before-you-add`](references/subtract-before-you-add.md) を読む。

- [`attack-the-premise`](references/attack-the-premise.md): Apply when two or more fixes that share one premise have failed the same gate. Take a census of which actors hold the imbalance before the next fix, then question the premise instead of writing another fix that assumes it.
- [`boundary-discipline`](references/boundary-discipline.md): Apply when wiring validation, error handling, or framework adapters. Concentrate guards at system boundaries (CLI, config, network, external APIs); trust internal types and keep business logic in pure functions.
- [`build-the-lever`](references/build-the-lever.md): Apply to any non-trivial work, not just bulk work: edits, migrations, analyses, checks. Build the tool that does it or proves it (codemod, script, generator, or a skill your subagents follow) instead of working by hand. The tool is the artifact a reviewer can rerun.
- [`encode-lessons-in-structure`](references/encode-lessons-in-structure.md): Apply when you catch yourself writing the same instruction a second time, or notice a recurring correction. Encode the rule as a lint, metadata flag, runtime check, or script instead of more text.
- [`exhaust-the-design-space`](references/exhaust-the-design-space.md): Apply when facing a novel UI interaction or architectural decision with no precedent in the codebase. Build 2-3 competing prototypes and compare side by side before committing.
- [`experience-first`](references/experience-first.md): Apply when product, UX, or feature-scope tradeoffs come up. Choose user delight over implementation convenience; ship fewer polished features over more rough ones.
- [`explain-the-number`](references/explain-the-number.md): Apply before you trust, report, or act on a number you measured: a speedup, a regression, a throughput, a latency, or an eval result. Find what limits it, and rule out that it measured something other than the work you think.
- [`fix-root-causes`](references/fix-root-causes.md): Apply when debugging. Trace each symptom to its root cause and fix it there; reproduce first, ask why until you reach it, resist nil-check guards that silence crashes.
- [`foundational-thinking`](references/foundational-thinking.md): Apply before writing logic: choosing core types and data structures, sequencing scaffold-vs-feature work, asking what concurrent actors share. Get the data structures right so downstream code becomes obvious.
- [`guard-the-context-window`](references/guard-the-context-window.md): Apply when context is filling up: large outputs, long files, repeated reads, fan-out planning. Route bulk to subagents; keep summaries in the main thread, not raw payloads.
- [`laziness-protocol`](references/laziness-protocol.md): Apply when refactoring, evaluating diff size, or tempted to add abstractions, layers, or signal threading. Bias toward deletion and the smallest change that solves the problem.
- [`make-operations-idempotent`](references/make-operations-idempotent.md): Apply when designing commands, lifecycle steps, or processing loops that run amid crashes, restarts, and retries. Converge to the same end state regardless of partial prior runs.
- [`migrate-callers-then-delete-legacy-apis`](references/migrate-callers-then-delete-legacy-apis.md): Apply when introducing a new internal API while old callers still exist. Migrate callers and delete the old API in the same wave instead of preserving compatibility layers.
- [`minimize-reader-load`](references/minimize-reader-load.md): Apply when reviewing or shaping code that's hard to trace. Count layers between question and answer, and hidden state in the reader's head; collapse one-caller wrappers and shrink mutable scope.
- [`model-the-domain`](references/model-the-domain.md): Apply when writing stateful logic, or when code branches a lot or repeats a shape assumption across files.
- [`never-block-on-the-human`](references/never-block-on-the-human.md): Apply when tempted to ask 'should I do X?' on reversible work.
- [`outcome-oriented-execution`](references/outcome-oriented-execution.md): Apply during planned rewrites and migrations with explicit phase boundaries. Converge on the target architecture; don't preserve smooth intermediate states with throwaway compatibility code.
- [`prove-it-works`](references/prove-it-works.md): Apply after completing a task, before declaring done. Verify against the real artifact (run the feature, read the actual value, inspect the diff), not a proxy, self-report, or 'it compiles.'
- [`redesign-from-first-principles`](references/redesign-from-first-principles.md): Apply when integrating a new requirement into an existing design.
- [`separate-before-serializing-shared-state`](references/separate-before-serializing-shared-state.md): Apply when concurrent actors might write to the same file, branch, key, or state object. Eliminate the sharing first; serialize structurally only when one shared writer is a real invariant.
- [`sequence-verifiable-units`](references/sequence-verifiable-units.md): Apply to multi-step work (sweeps, migrations, runs of similar edits) and to how you stack commits and PRs. Break work into small units that each end in a verifiable state, check each before the next, and order delivery so the sequence proves itself to a reviewer.
- [`subtract-before-you-add`](references/subtract-before-you-add.md): Apply when sequencing an addition, refactor, or rewrite. Remove dead code, redundant validators, and stub references first, then build on the simpler base.
- [`test-behavior-not-implementation`](references/test-behavior-not-implementation.md): Apply when you write, change, or keep a test. Call the code as its users do and assert the exact result they see. Rewrite or delete a test that would pass if every imported function returned undefined.
- [`type-system-discipline`](references/type-system-discipline.md): Apply when designing types, reviewing a function signature, or writing code in any statically-typed language. Make illegal states unrepresentable, brand semantic primitives, parse external data at boundaries, refuse to lie to the compiler, exhaust variants, derive from authoritative schemas.
