# oxlint-plugin-decision

- Write lint rules expressed in prose in `decision-rules.ts` with `defineDecisionRule`, and enable them in `vite.config.ts`. Answers are cached in `node_modules/.cache/oxlint-plugin-decision`
- `vp check` uses `OPENROUTER_API_KEY` from `.env` for judgments
- Use a paid decider only for rules that the free `openrouter/respan/span-01-lite` cannot judge. Check whether it can judge by clearing the cache and running violation examples and non-violation examples with known answers under `OXLINT_DECISION_EXPLAIN=json`. This is so that you do not pay even for rules that can be judged for free
- Do not change the model a rule uses without the user's instruction
- Report as violations only what you are certain of. Accept misses, and do not lower the threshold to catch them
