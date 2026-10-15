# typescript-template の骨格

masseater/typescript-template から作り直したリポジトリで確かめる、テンプレートが持ち続けている要素の一覧である。

各要素を「入り・効き・残り」の 3 点で見る。細部の正は、テンプレートの実物（root の `vite.config.ts`、`.claude/hooks/`、`.vite-hooks/`、`.github/workflows/`、`apps/*/`）にある。

## 1. 道具立ては Vite+（vp）ひとつ

- 入り: root と各 app の `vite.config.ts`、`package.json` の scripts が vp 経由、`devEngines` が pnpm
- 効き: `git config core.hooksPath` が `.vite-hooks/_` を指し、`.vite-hooks/{pre-commit,commit-msg,pre-push}` が vp を呼ぶ。CI が `voidzero-dev/setup-vp` で install と verify を回す。エージェントの pnpm 直実行が `.claude/settings.json` の deny と `block-pnpm.ts` で止まる
- 残り: turbo.json、husky、yarn・npm・bun のロックファイル、生の pnpm や npx や prettier を呼ぶ script や CI

## 2. 依存のバージョンは pnpm カタログに一本化

- 入り: `pnpm-workspace.yaml` の `catalog` と `catalogs: stack`、`catalogMode: prefer`、依存が `catalog:` と `catalog:stack` を参照
- 効き: `vp run verify` の syncpack が通り、同じ依存の複数バージョンを許さない
- 残り: カタログにあるのに直書きした依存、パッケージに散った同じ依存の別バージョン

## 3. monorepo の構成は Nx スタイル（`apps/`・`libs/`・`tools/`）、パッケージマネージャは pnpm のまま

- 入り: パッケージが `apps/`（アプリ）・`libs/`（共有するコード）・`tools/`（リポジトリの道具）に分かれ、`pnpm-workspace.yaml` の `packages` がこれらを挙げる
- 効き: `vp install` と `vp run -r` が、ワークスペースのパッケージを解決して回る
- 残り: `nx.json` や `@nx/*` を入れた形跡、`apps/`・`libs/`・`tools/` の外に散ったパッケージ

## 4. 型は tsgo（@effect/tsgo）で見る

- 入り: `@effect/tsgo`（`catalog:stack`）、全パッケージの tsconfig が `tsconfig.base.json` を `extends`、app の `prepare` が `effect-tsgo patch --typescript --oxlint` を回す
- 効き: `vite.config.ts` の `vp check` で `typeAware: true` と `typeCheck: true` が有効、`@effect/tsgo/oxlint-presets` の effect ルールが読み込まれている、`tsconfig.base.json` の `strict`・`exactOptionalPropertyTypes`・`noUncheckedIndexedAccess` が生きたまま
- 残り: 独自の緩い tsconfig が継承を置き換えていないか、preset の読み込みを外していないか、patch の prepare を消していないか

## 5. Effect を土台にする

- 入り: `effect` 依存、境界（外部入力・外部 API）とドメインが Effect・Layer・Context・Schema で組まれている
- 効き: 境界の値がライブラリの型のまま `Schema.decode*` に渡る、外部 API のクライアントが Effect 公式 → distilled.cloud → OpenAPI 生成の順で選ばれている、時間やお金を使う処理が `Effect.withSpan` で見える
- 残り: 素の Promise と try/catch のドメイン、valibot や zod の併存、手書きの API ラッパー

## 6. fallow で死にコード・重複・脆弱性・依存を見る

- 入り: `.fallowrc.jsonc`、root と app の `fallow` script、verify の `fallow-all`
- 効き: `vp run -r fallow` が型認識とセキュリティ検査を含めて回り、通る（`--fail-on-issues` のような失敗条件が生きている。緩めると緑の意味が消える）
- 残り: knip・jscpd・ts-prune などの置き換えられた設定や script、rc と script に二重になった設定

## 7. 検証の入口は vp run verify ひとつ

- 入り: `vp run verify` が検証の入口として存在する（今のテンプレートは root `vite.config.ts` の `run.tasks.verify` と dependsOn のグラフ。script の連鎖でも、1 つの入口から検査がまとめて回っていれば働いている）
- 効き: `.vite-hooks/pre-push`、CI の verify ジョブ、`.claude/hooks/stop-gate.ts` が同じ `vp run verify` を呼ぶ。リポジトリに対象のある検査（test・eslint・syncpack・markdown-lint・renovate・actions-lint・steiger・db:check・fallow・audit など）が verify の入口から回っている
- 残り: verify の外に散った検査、対象が無いのに残ったタスク、タスクの削除で緑にした形跡

## 8. 手元と CI のゲートが効いている

- 入り: `.vite-hooks/` と `.github/workflows/` の verify のセット。今のテンプレートは autofix・up-to-date・zap の workflow を持ち、deploy と release は verify の workflow のジョブ
- 効き: main の直近の verify が緑（`gh run list --branch main --limit 5`）。ルールセットの必須チェックに挙がる名前のジョブがワークフローに実在し、実際に報告される（`gh api repos/{owner}/{repo}/rulesets` と `gh workflow list`。報告されない必須チェックは PR を止める）。デプロイするなら deploy ジョブが緑で、README の「公開先」の URL が応答する
- 残り: 前身の workflow（deploy.yml・verify-autofix.yml など）、このリポジトリでは決して動かない条件（`github.repository == 'masseater/typescript-template'` のままの release ジョブなど）

## 9. エージェント用の設定が生きている

- 入り: `.claude/hooks/` 一式、`.claude/settings.json`、`.claude/loop.md`、`AGENTS.md` と `CLAUDE.md`、`.intent/hooks/intent-claude-gate.mjs`、`.agents/skills`（`.claude/skills` から張る）と `skills-lock.json`
- 効き: settings.json の hooks が実在のファイルを指して起動時に走る。`skills ls` と `vp exec intent list` がスキルを返す。セッション開始でテンプレートの新リリースが案内される
- 残り: 移行前の `.claude/rules/` や旧スキルの残骸、settings.json が指す実在しないファイル

## 10. デプロイは Alchemy で宣言する（デプロイするリポジトリ）

- 入り: `apps/<name>/alchemy.run.ts`、`app-name.ts` とそのテスト、リソース名が `app-name.ts` から取られている
- 効き: `vp run deploy` が通り、CI の deploy ジョブが secrets で回る
- 残り: wrangler.toml や wrangler の直呼び、Terraform や Pulumi の併存

## 11. 冗長な設定をしない

- 同じ関心の持ち主が 1 つであること。tsconfig の共通部は `tsconfig.base.json`、依存の版はカタログ、アプリ名は `app-name.ts`、環境変数は環境ごとに変わる値だけ
- 置き換えの後始末が済んでいること。prettier → oxfmt、eslint CLI 直接 → `vp check`、knip → fallow、husky → `.vite-hooks` のように、旧い側の設定・依存・script が消えている
- 無効化が増えていないこと。`oxlint-disable` と `eslint-disable` のコメント、`ignorePatterns` の追加、severity の緩和が、移行の都合で増えていないか

## 12. 無駄なドキュメント、無駄なコードコメントを削除する

- 入り: `vite.config.ts` の lint に `no-comments/disallowComments` が error で入り、許すのは `oxlint-disable` と `eslint-disable` だけ
- 効き: `vp run verify` の lint が、コメントを含むコードを落とす
- 残り: 経緯や理由を書いたコメントやドキュメント、前の構成のままの README や docs、移行の間に書いたメモ
