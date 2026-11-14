# oxlint-plugin-decision

- `decision-rules.ts` に `defineDecisionRule` で記述したリントルールを文章で書き、`vite.config.ts` で有効化する。回答は `node_modules/.cache/oxlint-plugin-decision` にキャッシュされる。
- `vp check` は `.env` の `OPENROUTER_API_KEY` を判定に使用する。
- 無料の `openrouter/respan/span-01-lite` では判定できないルールにのみ、有料のディデッサーを使用する。キャッシュをクリアし、`OXLINT_DECISION_EXPLAIN=json` で違反例と解答が既知の違反例を実行して、判定可能かを確認する。これにより、無料で判定できるルールであっても費用を支払わなくて済むようにする。
- ユーザーの指示なしに、ルールが使用するモデルを変更しない。
- 確実に判定できるもののみを違反として報告する。ミスは受理し、それを検知するために閾値を下げない。
