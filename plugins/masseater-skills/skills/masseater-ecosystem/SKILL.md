---
name: masseater-ecosystem
description: masseaterのリポジトリで作業する際のエントリーポイント。状況に応じてどのスキルを読み込むべきか、masseaterのテックスタックの完成形、そして自社開発のものと借用したものの境界線を示す。リポジトリで作業を開始する際、技術やサービスを選択する際、自前で開発するか既存のものを利用するかを判断する際、新しい言語やフォーマット、配布先を追加する際、そしてリポジトリの構造を変更する際に参照すること。
---

# masseater-ecosystem

- テックスタックの完成形と、開発と借用の境界については、[`tech-stack`](references/tech-stack.md)を参照すること。

## なぜこのスキルが必要で、どのような状態を目指すべきか

このスキルが必要な理由は、AIが技術を選択する際、一般的な開発者向けの回答でその隙間を埋めるからだ。一般的な回答は、多くの人に影響を与え、他の環境でも通用するOSSのアップデートフローに沿った汎用的な選択肢を推奨する。masseaterは自社のためだけに開発を行い、ベンダーロックインを容認し、気になる点があればすぐにAIで修正するため、そうした回答は当てはまらない。逆に、AIにとって記述は高速であるため、境界がなければ言語仕様に沿ったコア部分まで作り始めてしまい、ツールの開発自体が目的となってしまう。スキルについても同様のことが言える。各スキルが保持するのは単一の状況におけるルールのみであるため、AIは読み取ったスキルのみを辿り、2つのスキルにまたがる判定は両方のスキルに書き込まれ、2つのコピーは互いに乖離してしまう。

このスキルが実現すべき状態とは、masseaterが単に「これが欲しい」と言っただけで、手作業を一切必要とせずに構築・動作する状態のことだ。

## どのような状況でどのスキルを読むか

作業に取り掛かる前に、その状況に対応するスキルを読んでおくこと。これは、他のスキルを名称で指す唯一のスキルである。2つのスキルにまたがる判定は、どちらか一方ではなく、ここに記述される。

### リポジトリで作業を開始するとき

- 常に、他のいかなる作業よりも先に：`repo-conventions` と `vite-plus`

### 何かを決めるとき

- 新しい処理、ヘルパー、ラッパー、ツール、または外部APIクライアントの記述を開始する前に：`find-before-build`
- バグの原因や、2つの選択肢のうちどちらが速いかなど、推測で何かを解決しようとするとき：`measure-dont-guess`
- ライブラリや新しい実装方法を導入する際：`integrate`
- ログインやAccessの背後にあるものを構築または調査する場合：`debug-like-a-human`
- Cloudflareにデプロイするものを設計する際：`cloudflare-caution`

### リポジトリ自体を操作する場合

- トレース、メトリクス、またはログを追加する際：`measure-everything`
- バグを修正したプルリクエストを振り返るとき：`measure-postmortem`。`measure-everything` に従って、不足している測定値を追加する。
- 誰かが後で取り出したいと思う事実が記録・帰属・保持されているかを確認する場合：`measure-readiness`。`measure-everything` に従って、欠落している測定値を追加する。
- プロジェクトの設計を確認する際：`project-checklist`。Cloudflareで動作するものはすべて、`cloudflare-caution` にも従うこと。
- リポジトリの簡略化を求められた際：`simplify-repo`
- プルリクエストをマージする際は、`repo-conventions` の「PR とマージ」セクションに従う。自動マージを有効にして、マージキュー経由でマージする。

### 何かを作るとき

- Reactコンポーネント、ローダー、またはサーバー処理を記述する際：`how-to-use-react`
- デスクトップアプリを作成する際：`desktop-app-quality`
- ドキュメント、コミットメッセージ、プルリクエストボディ、記事など、人間が読むテキストを記述する場合：`writing`。`writing` は `humanity-and-humanness` をベースにしているので、両方を読むこと。
- 説明、提案書、または報告書の本文を執筆する際：`build-explanation`
- スキルの作成または修正を行う際：`skill-authoring`。`writing` と `humanity-and-humanness` に従って本文を書く。
- ユーザーに意思決定を求める際や、ユーザーのフィードバックの意図を読み取る際：`humanity-and-humanness`
- 持ち主に向けてチャットに報告や確認を書く際、説明資料を HTML で作る際、UI を作り始める際：`cognitive-load`
- 持ち主に見せる説明資料を HTML で作る際：`gitbook-pages`。書く中身は `cognitive-load` に従う。
- 日次監査（全リポジトリの日次点検）を行う際：`daily-check`。`daily-check` は次のスキルをこの順に読み込んで実行する：`check-cloudflare-cost`、`check-ci-duration`、`check-upstream-exits`、`check-similar-code`、`check-repeated-corrections`、`check-repo-conventions`、`adopt-library-features`。`check-` で始まるスキルは何も変更せず、`adopt-library-features` だけがコードを変更する。`check-similar-code` と `check-repeated-corrections` は `repo-conventions` の usecases/sweep-repeated-corrections.md の手順に従う。`check-cloudflare-cost` は `cloudflare-caution` に従う。`adopt-library-features` は `integrate` に従って導入する。
- プロジェクトのスレッドを横断して、作業の質、部分最適、スレッド間の矛盾を見直す統合監査を行う際：`integrated-audit`
