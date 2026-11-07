---
name: repo-conventions
description: masseater のリポジトリに共通の決まり。masseater/typescript-template から作ったリポジトリや、AGENTS.md がこの skill を指すリポジトリで作業を始めるときに読む。
---

# repo-conventions

- リポジトリの AGENTS.md と CLAUDE.md の決まりは、この skill より優先する
- コマンドの実行は vite-plus に、計測は measure-dont-guess に、既存のものを探すのは dont-it-yourself に従う
- 作業の完了は `vp run verify` が通ることである

## この skill が必要な理由と達成したい状態

この skill が必要な理由は、masseater のリポジトリがどれも同じテンプレートから作られ、同じ決まりを持つことにある。決まりを各リポジトリの AGENTS.md に写すと、直すたびに全リポジトリを書き換えることになり、直し忘れたリポジトリから古い決まりのまま作業が進む。

この skill で達成したい状態は、どのリポジトリでも同じ決まりで作業が進み、AGENTS.md にはそのリポジトリにしか無いことだけが残っていることである。

## 手段の選び方

強制・推奨・指示の手段は次の順で選ぶ。自作するときは、何を探して何が合わなかったかをコミットメッセージに残す。

1. ライブラリ公式の統合手段。lint ルール、skill、plugin、CLI、diagnostics などである
2. それを実現している既存のライブラリやツール
3. 方針を提言しているブログ・issue・discussion
4. 自作

どこまでを自作し、どこからを借りるかの境目と、技術スタックの完成形は masseater-ecosystem に従う。

検査を通すために設定を無効化・簡易化したり、閾値を下げたり、抑止ディレクティブを使ったりしない。数値の設定はツールの既定値を保ち、既定値で検査が機能しないときだけ公式の指針で設定する。緩めた検査は、通っても何も保証しないからである。

## 文書

- 手書きの文章は、ルートの CLAUDE.md・README.md・ARCHITECTURE.md・DESIGN.md と docs/ に限る。コードを読めば分かることは書かない
- ARCHITECTURE.md には、ワークスペースと層の地図と、依存してよい向きなどの不変条件だけを短く書く。頻繁に変わることは書かず、名前はリンクにしない。変わるたびに同期させず、境界や不変条件が変わるときだけ直す
- 「なぜ」はコミットメッセージに書く
- デプロイ先や外部に公開しているもの（サイト、API、npm パッケージなど）があれば、その URL を README に一覧で載せる

## 配置

- 設定を含め、すべてワークスペース内に置く
- ワークスペースは apps・libs・tools・infra に分け、アプリのデプロイ設定は apps に置いて infra の部品を使う
- アプリの src/ 直下には FSD のレイヤーだけを置く。使われる場所の近くに置き、再利用されるまで切り出さない
- 定数・設定値・スキーマ・ルールの ID は一か所で定義し、ほかはそこから参照する

## コード

- UI 状態は effect-atom、サーバー状態は TanStack Query だけで扱う
- 状態は排他的な status を持つ判別共用体で表し、boolean フラグの組を使わない
- ライブラリが型を提供する値は、その型のまま `Schema.decode*` に渡す。`unknown` で受けると、ライブラリの型と Schema の食い違いをコンパイラが見つけられなくなる
- ライブラリが export する型・スキーマ・enum・定数を書き写さない
- 外部 API のクライアントは手で包まず、Effect 公式のパッケージ、distilled.cloud（Cloudflare は `@distilled.cloud/cloudflare`）、公開 OpenAPI から `@effect/openapi-generator` で生成、の順に選ぶ
- 環境変数は環境ごとに変わる値だけにする。変わらない値はコードか Alchemy の設定に、ツールにフラグがあればフラグにする。環境変数が 1 つ増えるたびに、どの環境で何を設定するかの考慮が増えるからである
- Alchemy に足りない設定は、alchemy にパッチを当てず、カスタムリソースで定義する

## CI

- ワークフローの手順は masseater/typescript-template の `.github/actions/` にある composite action（verify・autofix・skills-lock・update-branches・credentials・ci-telemetry）を `masseater/typescript-template/.github/actions/<名前>@<sha>` で参照する。手順を各リポに写すと、直すたびに全リポを書き換えることになるからである。sha は renovate が上げる
- リポ固有のツール（uv・go・weaver・apt の依存など）は、そのリポの `.github/actions/setup` に置き、ジョブからは `$/.github/actions/setup` で呼ぶ。actionlint はまだ `$/` を知らないので、`.github/actionlint.yaml` でその 1 件だけを無視する
- Cloudflare・OpenRouter・Claude のトークンは credentials action が credentials.masseater.dev から受け取る。GitHub の Secrets に置かない
- bot がブランチへ push するワークフロー（autofix・skills-lock・update-branches）は、broker が出す GitHub App のトークンで push する。`GITHUB_TOKEN` で push すると、`pull_request` の `up-to-date` が承認待ち（action_required）で止まり、PR がマージされないまま残るからである。broker はワークフローのファイル名で権限を出すので、bot のワークフローを足したら masseater.dev の `credential-grants.ts` の `WORKFLOW_GITHUB_GRANTS` にも足す
- bot の PR は auto-merge で出す。main が進んで遅れた PR には `update-branches.yml` が main を取り込む
- `.claude/skills` は `.agents/skills` へのリンクなので、`.agents/skills/.gitkeep` を追跡する。リンク先が無いと Actions が composite action を取り込むときに落ちる

## PR とマージ

- PR のレビュー、PR ごとの CI・動作検証・デプロイはしない。動作は main にマージしてデプロイした本番で確かめる
- マージ前に base を取り込み、手元の `vp run verify` を通してから自分でマージする。マージしてよいかは聞かない
- ルールセットのバイパスや `--admin` は使わない
- release-please のリリース PR は `verify` を手動実行して作り直す。手動実行では App のトークンで PR を作るので、`up-to-date` は承認なしで動く

## 脆弱性

- ZAP のアラートは警告も含めすぐ直す。誤検知だけを `.github/zap/rules.tsv` に書く
- `audit` は `vp pm audit --fix` で直す。修正版の無い勧告だけを `audit.ignore` に載せ、理由をコミットメッセージに書く

## スキル

- 編集の前に、リポジトリのルートで `vp exec intent list` を実行する。合う skill があれば `vp exec intent load <package>#<skill>` で読む。`intent` が無いときはインストールせず、不足を報告する
- 複数リポで使う自作スキルは masseater/skills に置き、skills CLI で入れる

## セッションの始め

ユーザーと対話するセッションを始めたら、テンプレート更新の確認を求められていればそれを済ませてから、引数なしの `/loop` を起動する。内容はリポジトリの `.claude/loop.md` にある。

## 参照

当てはまるリポジトリでは、次も読むこと。

- [`cloudflare`](references/cloudflare.md)。Cloudflare にデプロイするリポジトリの決まり
- [`oxlint-plugin-decision`](references/oxlint-plugin-decision.md)。`vp check` で decision ルールを使うリポジトリの決まり
- [`instrumentation`](references/instrumentation.md)。スパン、CI の計測、Web Vitals の決まり

## 用途

- [`publish-npm-package`](usecases/publish-npm-package.md)。npm にパッケージを出す
