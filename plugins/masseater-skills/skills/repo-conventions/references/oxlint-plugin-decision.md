# oxlint-plugin-decision

- `decision-rules.ts` に `defineDecisionRule` で記述したリントルールを文章で書き、`vite.config.ts` で有効化する。回答は `node_modules/.cache/oxlint-plugin-decision` にキャッシュされる。
- ユーザーの指示なしに、ルールが使用するモデルを変更しない。
- 確実に判定できるもののみを違反として報告する。ミスは受理し、それを検知するために閾値を下げない。
