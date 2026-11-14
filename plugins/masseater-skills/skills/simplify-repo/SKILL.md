---
name: simplify-repo
description: Simplify the whole repository.
---

# simplify-repo

The target is the whole main branch. Do not look only at a diff or only at the part you were in charge of. You may look at the history, the change log and the intentions of the people who did the work, but not as a substitute for looking at the whole.

1. First check that mechanical detection such as oxlint, fallow and steiger runs over the whole repository
2. Have simplify-reviewer review the whole of main
3. Turn the findings into a list of tasks. Decide on every one of them yourself and proceed
4. Land PRs in units of meaning, in this order: what a machine can assert, consolidation, documentation
5. When you think you are done, have it review again
6. If the result does not satisfy it, do not call it complete; fix it and repeat the review
