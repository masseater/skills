# Check similar code

Find similar functions that should be merged or recorded as intentional. `fallow dupes` in verify already rejects copied code; similar functions can be intentional, so this check decides case by case instead of failing verify.

1. Follow the similar-code step of the repeated-corrections sweep that the hub points to for each repository: the candidates come from `fallow similar-code`, each is read with `inspect`, and verdicts live in `similar-code-verdicts.json` at the repository root.
2. For each candidate without a verdict, decide. Two functions doing the same thing: merge them. An intentional similarity: record `candidate_id`, `review_key` and the reason.
3. Do not edit the repository. Send the merges and the verdicts to the owner as the concrete change, and finish with the instruction to rerun `review --require-verdict-for-each-candidate` after the change.
