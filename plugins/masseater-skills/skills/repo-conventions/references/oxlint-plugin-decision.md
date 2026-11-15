# oxlint-plugin-decision

- `decision-rules.ts` に `defineDecisionRule` で記述したリントルールを文章で書き、`vite.config.ts` で有効化する。回答は `node_modules/.cache/oxlint-plugin-decision` にキャッシュされる。
- `vp check` は、AI Gateway 経由で Workers AI 上の `cloudflare/@cf/qwen/qwen3.8-27b` を用いて判定を行う。`CLOUDFLARE_ACCOUNT_ID` と `CLOUDFLARE_API_TOKEN`（Workers AI Read）を読み取る。CI では、credentials アクションが両方を渡す。
- ルールを `openrouter/` モデルに切り替えないこと。ルールに別の Workers AI モデルを選ぶ前に、キャッシュをクリアし、既知の違反例や合格例を `OXLINT_DECISION_EXPLAIN=json` で実行して、判定できることを確認すること。
- ユーザーの指示なしに、ルールが使用するモデルを変更しない。
- 確実に判定できるもののみを違反として報告する。ミスは受理し、それを検知するために閾値を下げない。
