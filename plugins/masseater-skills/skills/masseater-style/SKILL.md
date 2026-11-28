---
name: masseater-style
description: masseaterのリポジトリで作業する際のエントリーポイント。状況に応じてどのスキルを読み込むべきか、masseaterのテックスタックの完成形、そして自社開発のものと借用したものの境界線を示す。リポジトリで作業を開始する際、技術やサービスを選択する際、自前で開発するか既存のものを利用するかを判断する際、新しい言語やフォーマット、配布先を追加する際、そしてリポジトリの構造を変更する際に参照すること。
---

# masseater-style

- テックスタックの完成形と、開発と借用の境界については、[`tech-stack`](references/tech-stack.md)を参照すること。
- 基本の開発フロー、masseater.dev と ecosystems のどちらにコードを置くか、独立したリポジトリに分けるときについては、[`development-flow`](references/development-flow.md)を参照すること。

## なぜこのスキルが必要で、どのような状態を目指すべきか

このスキルが必要な理由は、AIが技術を選択する際、一般的な開発者向けの回答でその隙間を埋めるからだ。一般的な回答は、多くの人に影響を与え、他の環境でも通用するOSSのアップデートフローに沿った汎用的な選択肢を推奨する。masseaterは自社のためだけに開発を行い、ベンダーロックインを容認し、気になる点があればすぐにAIで修正するため、そうした回答は当てはまらない。逆に、AIにとって記述は高速であるため、境界がなければ言語仕様に沿ったコア部分まで作り始めてしまい、ツールの開発自体が目的となってしまう。スキルについても同様のことが言える。各スキルが保持するのは単一の状況におけるルールのみであるため、AIは読み取ったスキルのみを辿り、2つのスキルにまたがる判定は両方のスキルに書き込まれ、2つのコピーは互いに乖離してしまう。

このスキルが実現すべき状態とは、masseaterが単に「これが欲しい」と言っただけで、手作業を一切必要とせずに構築・動作する状態のことだ。

## 原則

判断に迷ったときは、次の 5 つに戻ること。

1. masseater のことだけを考える。他の人の環境、一般的な利用者、将来現れるかもしれない第三者のための汎用性は、設計の理由にしない。公開するものも、masseater が使うために公開している。
2. 1 つの場所ですべてを管理する。コード、設定、ドキュメント、スキルは、置き場所を 1 つに決め、同じものを 2 か所に持たない。既定はすべてを 1 つのモノレポに置くことである。
3. 分けるのは、必要になったときだけにする。必要になる前に、リポジトリ、パッケージ、抽象化、設定を分けない。
4. 「必要になったとき」は、いま起きている事実で判定する。「いつか要りそう」「分けた方がきれい」は理由にならない。判定する条件は [`development-flow`](references/development-flow.md) の「必要になったとき」に書いてあり、条件を満たしたと言うときは、その事実を示すこと。
5. 推測せず、計測する。原因、速さ、費用、必要かどうかは、記憶や「おそらく」で決めず、測った値で決める。どう測るかは `measure-dont-guess` に従う。

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
- スケジュールされたタスクが実行ごとにClaudeに渡す指示文を記述または修正する場合：`scheduled-task-prompt`
- ユーザーに意思決定を求める際や、ユーザーのフィードバックの意図を読み取る際：`humanity-and-humanness`
- 持ち主に向けてチャットに報告や確認を書く際、説明資料を HTML で作る際、スライドや図を作る際、UI を作り始める際：`cognitive-load`
- 持ち主に見せる説明資料を HTML で作る際：`gitbook-pages`。書く中身は `cognitive-load` に従う。
- スライドやプレゼン資料を作る際：`slide-content`。構成とスピーカーノートは `build-explanation` の手順で作り、図は `infographic` で描き、`gitbook-slides` で組み立てる。見る人と聞く人の認知負荷を下げるために `cognitive-load` を読む。
- プレゼンのスライドを HTML や PDF に組み立てる際：`gitbook-slides`
- 業務の提案、見積もり、契約条件をすり合わせる資料を作る際：`work-proposal-deck`。スライドにするなら `slide-content` にも従う。
- 解説・紹介動画を作る際、動画の台本を書く際：`video-production`。Remotion のコードを書くときは、そのリポジトリに入っている Remotion 公式のスキルも読む。
- 資料、スライド、README に図やインフォグラフィックを描く際：`infographic`。見る人の認知負荷を下げるために `cognitive-load` を読む。
- 複数のリポジトリにまたがる似た関数を、足りない抽象化として見つける際：`cross-repo-similar-code`（cross-similar-code プラグインに入っている。プラグインを入れていないセッションでは plugins/cross-similar-code/skills/cross-repo-similar-code/SKILL.md を直接読む）。日次監査が毎日実行する。
- 日次監査（全リポジトリの日次点検）を行う際：`daily-check`。`daily-check` は次のスキルをこの順に読み込んで実行する：`check-cloudflare-cost`、`check-ci-duration`、`check-upstream-exits`、`check-similar-code`、`cross-repo-similar-code`、`check-repeated-corrections`、`check-repo-conventions`、`check-skill-rules`、`adopt-library-features`。`check-` で始まるスキルと `cross-repo-similar-code` は何も変更せず、`adopt-library-features` だけがコードを変更する。`check-similar-code` と `check-repeated-corrections` は `repo-conventions` の usecases/sweep-repeated-corrections.md の手順に従う。`check-cloudflare-cost` は `cloudflare-caution` に従う。`check-repo-conventions` はコードと構造を規約と比べて違反から検査を提案し、`check-skill-rules` はスキルの文から機械的に判定できるルールを探し、msch の検査に移してその文を削るよう依頼する。スキル全体の書き直しはしない。`adopt-library-features` は `integrate` に従って導入する。
- masseater.dev か ecosystems の main の verify が失敗したと CI から依頼が届いた際：`fix-red-main`。赤の原因を直す PR を失敗ごとに 1 つだけ出す。
- プロジェクトのスレッドを横断して、作業の質、部分最適、スレッド間の矛盾を見直す統合監査を行う際：`integrated-audit`
- コーディネーターが定期のアイドルスレッド点検に起こされた際：`push-idle-threads`。止まっているスレッドに理由を問い、続けるか終えるかを促す。
- 曲やパートを作る際、既存曲をリファレンスとして分析する際、作ったものが意図どおりか音を聴かずに確かめる際：`compose-music`。持ち主に残す範囲は `human-judgment-line` に従う。DAW が LUNA（UA の DAW）なら、LUNA の中の操作は `luna-music` と UA 公式プラグイン ua-luna-builder のスキルに従う。
- LUNA につなぐ際、LUNA のセッションにトラックやノートを置く際、ステムを書き出す際：`luna-music`。クラウドから SSH で持ち主の PC につなぐ。SDK の基本は UA 公式プラグイン ua-luna-builder のスキルに従う。
- 成果物の一部を持ち主の判断に回そうとする際、AI で機械化するのが難しい部分に気づいた際、新しいモデルが出て持ち主に任せる範囲を減らせるか確かめる際：`human-judgment-line`。持ち主に回してよいのは合意した一覧の項目だけで、それ以外は AI が自分で評価する。
- npm に新しい名前を出す際、Trusted Publisher を登録し直す際、古い版を deprecate する際、npm の承認リンクが届かない際：`npm-web-auth`。クラウドのセッションから持ち主の 2FA 承認を通す。公開そのものは `publish.yml` が行い、承認は要らない。
- 前の週に何をしたかを週次の記録として残す際：`weekly-review`。スケジュールされたタスクの指示文は `scheduled-task-prompt` に従い、このスキルを実行するとだけ書く。
- 定期のメモリ整理タスクが動いた際、持ち主にプロジェクトのメモリの整理を頼まれた際：`memory-tidy`。MEMORY.md とノートを短くまとめ直す。持ち主が述べた決まりとその理由は削らない。スケジュールされたタスクの指示文は `scheduled-task-prompt` に従い、このスキルを実行するとだけ書く。
- 定期のタスクグラフ点検タスクが動いた際、持ち主にタスクグラフが最新か確かめるよう頼まれた際：`task-graph-check`。スレッド一覧と `graph.json` の差を見つけたら、自分で `graph.json` を直し、直した分はコーディネーターに報告しない。スケジュールされたタスクの指示文は `scheduled-task-prompt` に従い、このスキルを実行するとだけ書く。
