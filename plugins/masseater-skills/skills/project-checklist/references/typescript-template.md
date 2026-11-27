# TypeScriptテンプレートの骨組み

テンプレートからの移行におけるギャップは、ビルドやテストの失敗として表示されない。フックが1つ欠けていたり、古い設定が残っていたりしても、パスを確認すること。

- 各要素について、導入されているか、動作するか、古い構造が残っていないかの3点で判断する
- ファイルや依存関係が実際に存在するかどうかで導入を判断する
- 実行する仕組みが接続されており、実際に実行されているかで機能を判断する。設定ファイルにしか存在しないフックや、このリポジトリでは決して発火しない条件は動作していない
- 古い仕組みが置き換えられたか、あるいは同じ役割を持つ設定が重複しているかで、古い構造を判断する
- 詳細の真相は実際のテンプレート、つまりルートの `vite.config.ts`、`.claude/hooks/`、`.vite-hooks/`、`.github/workflows/`、`apps/*/` にある。このリストをコピーとして使用しないこと。
- テンプレートの新リリースで追加された要素を、不足していると判断しないこと。これは移行におけるギャップではなく、まだ実施されていない更新である。導入にあたっては、テンプレートの更新メカニズムに従うこと。
- 古い形式であっても、動作するものを不足していると判断しないこと。欠落することで何かが壊れる、あるいは暗黙的に無効化されるもののみを不足と呼べる。

## 1. ツールは Vite+ のみである

- はじめに：ルートと各アプリには `vite.config.ts` があり、`devEngines` は pnpm である。
- 機能：`git config core.hooksPath` は `.vite-hooks/_` を指し、`.vite-hooks/{pre-commit,commit-msg,pre-push}` は vp を呼び出す。CI は `voidzero-dev/setup-vp` でインストールと検証を行う。pnpm を直接実行するエージェントは、`.claude/settings.json` および `block-pnpm.ts` の拒否によって停止される。

## 2. 依存関係のバージョンは pnpm カタログで統一されている

- はじめに：`pnpm-workspace.yaml` には `catalog`、`catalogs: stack`、`catalogMode: prefer` があり、依存関係は `catalog:` および `catalog:stack` を指す。
- 機能：`vp run verify` における syncpack はパスされ、同一の依存関係の複数バージョンは許可されない。
- 古い構造：カタログ内に依存関係のハードコード版が存在するか、あるいは同一の依存関係の異なるバージョンがパッケージ間に散在していないかを確認する。

## 3. モノレポは Nx スタイルで構成されており、pnpm が引き続きパッケージマネージャーとして機能する

- はじめに：パッケージは、アプリ用の `apps/`、共有コード用の `libs/`、リポジトリツール用の `tools/` に分かれており、`pnpm-workspace.yaml` の `packages` にそれらが列挙されている。
- 機能：`vp install` および `vp run -r` は、ワークスペースのパッケージを解決して実行する。
- 古い構造：`@nx/*` がインストールされた痕跡があるか、また `apps/`、`libs/`、`tools/` の外にパッケージが散在していないかを確認する。

## 4. 型は `@effect/tsgo` でチェックされる

- はじめに：`catalog:stack` の `@effect/tsgo` が存在し、すべてのパッケージの tsconfig が `tsconfig.base.json` を `extends` しており、各アプリの `prepare` が `effect-tsgo patch --typescript --oxlint` を実行する。
- 機能：`vite.config.ts` の `vp check` で `typeAware: true` および `typeCheck: true` が有効になっており、`@effect/tsgo/oxlint-presets` のエフェクトルールが読み込まれ、`tsconfig.base.json` の `strict`、`exactOptionalPropertyTypes`、および `noUncheckedIndexedAccess` が引き続き有効である。
- 古い構造：カスタムのルーズな tsconfig が継承を置き換えていないか、プリセットの読み込みが削除されていないか、および prepare 内のパッチが削除されていないかを確認する。

## 5. Effect を基盤としたビルド

- はじめに：`effect` 依存関係があり、外部入力や外部 API との境界、およびドメインは、Effect、Layer、Context、Schema で構築されている。
- 機能：境界値はライブラリの型そのままの状態で `Schema.decode*` に渡され、外部 API のクライアントは、公式の Effect、distilled.cloud、OpenAPI から生成された順に選択され、時間やコストがかかる処理は `Effect.withSpan` で可視化される。
- 古い構造：単純な Promise と try/catch があるか、あるいは手書きの API ラッパーがあるかを確認する。

## 6. デッドコード、重複、脆弱性、およびフォールow を伴う依存関係を確認する

- はじめに：`.fallowrc.jsonc`、ルートおよびアプリ内の `fallow` スクリプト、および verify 内の `fallow-all` が存在する。
- 機能：`vp run -r fallow` を実行し、型認識とセキュリティチェックを含めて渡し、`--fail-on-issues` などの失敗条件が引き続き有効である。これらを緩めると、green の意味が消える。
- 古い構造：rc とスクリプト間で設定が重複していないかを確認する。

## 7. 検証の単一のエントリポイントは `vp run verify` である

- はじめに：検証のエントリポイントとして `vp run verify` が存在する。現在のテンプレートでは、ルートの `vite.config.ts` にある `run.tasks.verify` とその dependsOn グラフがエントリポイントとなっており、スクリプトが連鎖していても、一つのエントリポイントからチェックがまとめて実行されていれば動作する。
- 機能：CI の検証ジョブである `.vite-hooks/pre-push` と `.claude/hooks/stop-gate.ts` は、同じ `vp run verify` を呼び出す。test、syncpack、markdown-lint、renovate、actions-lint、steiger、db:check、fallow、audit など、リポジトリ内にターゲットを持つチェックは、エントリポイントから実行される。
- 古い構造：検証の外にチェックが散在していないか、ターゲットのないタスクが残っていないか、あるいはタスクを削除してgreenにした痕跡がないかを確認する。

## 8. ローカルゲートとCIゲートが有効である

- はじめに：`.vite-hooks/` と `.github/workflows/` には検証が設定されている。現在のテンプレートでは autofix、updated および zap workflows があり、deploy と release は検証ワークフロー内のジョブとなっている。
- 機能：main 上の最新の検証はgreenである。`gh run list --branch main --limit 5` で確認する。ルールセット内の必須チェックとしてリストされている名前のジョブは、実際にワークフローに存在し、報告されている。`gh api repos/{owner}/{repo}/rulesets` および `gh workflow list` で確認する。報告されない必須チェックはPRをブロックする。デプロイを行うリポジトリでは、deploy ジョブがgreenであり、READMEの「where it is published」にあるURLが応答する。
- 古い構造：deploy.yml や verify-autofix.yml といった前身のワークフローが消えていないか、また release ジョブが依然として `github.repository == 'masseater/typescript-template'` に設定されているなど、このリポジトリで決して実行できない条件がないかを確認する。

## 9. エージェントの設定が有効である

- はじめに：`.claude/hooks/`、`.claude/settings.json`、`.claude/loop.md`、`AGENTS.md` および `CLAUDE.md`、`.agents/skills`（`.claude/skills` からリンクされている）、直接依存関係のスキルを承認する `pnpm-workspace.yaml` の `permissions`、そしてルートの `vite.config.ts` の `skills` セクション全体が存在する。TanStack Start を使用するリポジトリには、`.intent/hooks/intent-claude-gate.mjs` も存在する。
- 機能：`skills ls` はスキルを返し、エージェントのスキルディレクトリには承認済みの依存関係が配布するスキルが格納される。`vp exec intent list` は、`.intent/hooks` を持つリポジトリ内のスキルを返す。テンプレートの新リリースは、セッションの開始時に告知される。
- 古い構造：古いスキルの残骸がないかを確認する。

## 10. デプロイを行うリポジトリが Alchemy で宣言している

- はじめに：`apps/<name>/alchemy.run.ts`、`app-name.ts` およびそのテストが存在し、リソース名は `app-name.ts` から取得されている。
- 機能：`vp run deploy` がパスし、CI のデプロイジョブがシークレット付きで実行される。

## 11. 冗長な設定がない

- 各ロールに単一のオーナーを付与する。`tsconfig.base.json` に tsconfig の共通部分、カタログに依存関係のバージョンを、`app-name.ts` にアプリ名を記述し、環境変数には環境ごとに変化する値のみを設定する。

## 12. 不要なドキュメントを削除する

- 古い構造：履歴や理由を記述したドキュメント、以前の構造を記述した README やドキュメント、およびマイグレーション中に書かれたメモがなくなっているかを確認する。

## 13. CI が差分とキャッシュを用いて効率的に動作する

- はじめに：verify は PR ではなく、main への push 時と手動ディスパッチ時にのみ動作する。PR 側の唯一のゲートは、必須の `up-to-date` チェックである。commitlint と Betterleaks は push された範囲のみを対象とし、actions-lint には `fetch-depth: 0` でフル履歴の取得を禁止するルールがある。deploy は sha がブランチの先頭である場合にのみ動作する。依存関係のインストールは setup-vp の `cache: true` でキャッシュされ、oxlint-plugin-decision の判定結果は `actions/cache` の restore and save で引き継がれる。
- 機能：main での最新の実行で確認する。`gh run view <run-id> --log` で依存関係キャッシュと oxlint-plugin-decision の判定キャッシュの復元が表示され、各プッシュターゲットのチェックは push された範囲のみを対象にする。PR ごとのレビューはないため、PR 側で main の更新に追従しているかを確認すれば十分である。
- 古い構造：PR ごとに verify を実行し、フル履歴を確認する、`fetch-depth: 0` 、キャッシュの復元や保存が欠落している、あるいは古い sha でも deploy が動作する、といった形式があるかを確認する。
