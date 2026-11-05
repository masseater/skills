# oxlint-plugin-decision

- 文章で書く lint ルールは `decision-rules.ts` に `defineDecisionRule` で書き、`vite.config.ts` で有効にする。答えは `node_modules/.cache/oxlint-plugin-decision` にキャッシュされる
- `vp check` は判定に `.env` の `OPENROUTER_API_KEY` を使う
- 有料の decider は、無料の `openrouter/respan/span-01-lite` で判定できないルールだけに使う。判定できるかは、正解の分かる違反例と違反でない例を、キャッシュを消して `OXLINT_DECISION_EXPLAIN=json` で確かめる。無料で判定できるルールにまで課金しないためである
- ルールが使うモデルは、ユーザーの指示なしに変えない
- 確信できるものだけを違反にする。取りこぼしは許容し、閾値を下げて拾いにいかない
