---
name: repo-conventions
description: masseaterのリポジトリに共通するルール。masseater/typescript-templateから作成されたリポジトリ、またはAGENTS.mdでこのスキルが参照されているリポジトリで作業を開始する際に参照すること。
---

# repo-conventions

- リポジトリのAGENTS.mdおよびCLAUDE.mdのルールは、このスキルよりも優先される。
- コマンドの実行にはvite-plusを、計測にはmeasure-dont-guessを、既存のものの特定にはdont-it-yourselfを使用すること。
- `vp run verify` がパスした時点で作業完了となる。

## このスキルが必要な理由と、実現すべき状態

masseaterのリポジトリはすべて同一のテンプレートから作成されており、同じルールを共有しているため、このスキルが必要となる。ルールを各リポジトリのAGENTS.mdにコピーすると、修正のたびにすべてのリポジトリを書き直すことになり、漏れていたリポジトリの古いルールのまま作業が進むことになる。

このスキルが実現すべき状態は、すべてのリポジトリで同じルールのもとで作業が進み、そのリポジトリ固有のものだけがAGENTS.mdに残ることである。

## 選び方

強制、推奨、指示の手段を以下の順序で選択すること。自身で作成する場合は、何を確認し、何が適合しなかったかをコミットメッセージに記録すること。

1. ライブラリの公式な統合手段：lintルール、スキル、プラグイン、CLI、診断機能など
2. これを実現する既存のライブラリやツール
3. ポリシーを提案するブログ、Issue、ディスカッション
4. 自身で作成する

自身でどの程度まで自作し、どこから借用するかの境界、およびテックスタックの完成形については、masseater-ecosystemに従うこと。

設定を無効化したり簡略化したり、閾値を下げたり、抑制ディレクティブを使用してチェックを通過させたりしないこと。数値設定はツールのデフォルト値のままとし、デフォルトでチェックが機能しない場合にのみ公式ガイドラインに従って設定すること。チェックを緩めると、たとえパスしたとしても何も保証されないことになる。

もはや何もしていない例外（off にしたルール、無視パターン、許可リストの単語、overrides、`cache: false`）は残さないこと。例外を外してチェックを実行し、それでもパスするなら例外を削除する。

## Pythonを使用しない

Pythonを使用しないこと。コード、スクリプト、CI、検証、または依存関係のどこにも配置しないこと。言語はTypeScriptとRustに限定されており、Pythonを一つの箇所に配置するということは、セッションとCIの両方でランタイム、パッケージ管理、およびバージョンピン留めを維持することを意味する。

- `.py`、`.ipynb`、`pyproject.toml`、`requirements.txt`、`uv.lock` などのPythonファイルを配置しないこと。
- ワークフロー、フック、タスク、またはスクリプトから `python`、`pip`、`pipx`、`uv`、`uvx`、`poetry` を呼び出さないこと。また、`actions/setup-python` や `astral-sh/setup-uv` も使用しないこと。
- Pythonまたはそのツールを、mise、renovate、またはMCP設定で記述しないこと。
- Pythonでしか動作しないライブラリやツールが必要な場合は、TypeScriptまたはRustで動作する別の手段に置き換えること。置き換えられないものは使用を中止し、中止したものはレポートに記載すること。
- Pythonで単発の調査や変換を一つも記述しないこと。
- mschはこれらを検出し、`vp run verify` を失敗する。

## まずはチェック方法を構築すること。

機能、ツール、ワークフロー、画面、インフラストラクチャなどの仕組みを構築する際は、まずそれが動作することを確認する方法を決定して構築し、その後に実装を開始すること。チェック方法を後回しにすると、チェック不可能な形で完了してしまい、確認が毎回エージェントが目視する作業になってしまう。

- 誰でも1つのコマンドで再現でき、同一の入力に対して同一の判定結果を返すチェック方法を作成し、`vp run verify` に記述すること。テスト、型、リント、スナップショット比較がこれに該当する。verify に含まれていないチェックは、次の変更時に誰も実行しなくなる。
- 見た目については、ヘッドレスでレンダリングされた画像をベースライン画像とピクセル単位で比較すること。テストから操作を送信すること。
- エージェントや人間が毎回実行して確認するチェックを、チェック方法の判定に用いないこと。処理速度が遅く、コストがかかり、判定が揺らぐ。
- 現在の環境にチェック手段がない場合は、ヘッドレスレンダリングやスタブ、テストホストなど、そのような手段を準備することを最初の作業とすること。
- ログインやAccessの後ろに、「所有者の認証が必要なためチェックできない」という部分を残してはいけない。AIが所有者の認証と同じ経路でアクセスする仕組みを構築することを計画の第一歩とすること。計画を記述する前に、人間のようなデバッグをロードすること。
- まず受入条件を確認し、それが失敗することを確認した上で実装するテストを書くこと。
- 本番環境の外部サービス、実機、リスニングや味覚の判定など、チェックできない部分だけを静的に残し、残りはレポートに記述すること。

## ドキュメント

- 手書きの文章は、ルートの CLAUDE.md、README.md、ARCHITECTURE.md、DESIGN.md、および docs/ に限定すること。コードを読んで学べることは書かないこと。
- コードを読めば分かること（機能の仕組み、どのファイルにどのロジックがあるか、リクエストの流れ、アプリやパッケージ、ページの一覧、公開 API のパラメータ、オプション、エンドポイント）を書かないこと。型とコードが正本であり、ドキュメントに写しを置いても、誰にも気づかれずに陳腐化していく。README には、それが何であるか、どう使い始めるか、どこで公開されているかを書く。
- ルートの README、AGENTS.md、CLAUDE.md にはリポジトリ全体のことを書き、1 つのワークスペースに属することは、そのワークスペースの README.md または AGENTS.md に書くこと。Claude Code の推奨どおり、各 AGENTS.md と CLAUDE.md は 200 行以内に収めること。どちらも msch が `vp run verify` を失敗させる。
- タスクが完了しても、その記録を AGENTS.md に追加しないこと。理由はコミットメッセージに書く。
- ARCHITECTURE.md には、ワークスペースとレイヤーのマップ、および依存関係の許容方向などの不変条件のみを簡潔に記述すること。頻繁に変更される内容は書かず、名前リンクも作成しないこと。変更があるたびに同期せず、境界や不変条件が変わった時にのみ修正すること。
- コミットメッセージに「なぜ」を書き込むこと。
- デプロイ対象や外部に公開しているもの（サイト、API、npmパッケージなど）がある場合は、README にそのURLを記載すること。

## 配置

- 設定を含め、すべてをワークスペース内に配置すること。
- ワークスペースをアプリ、ライブラリ、ツール、インフラに分割し、アプリのデプロイ設定はアプリに配置し、インフラのコンポーネントを使用すること。
- アプリの src/ 直下には FSD のレイヤーだけを置くこと。スライスは操作と対象ごとに細かく分け、テストやスタイルを含めてスライスの中に置く。規約から外れた置き方を、設定にファイルを列挙して検査に通さないこと。詳細は [`fsd`](references/fsd.md) に従うこと。
- 定数、設定値、スキーマ、ルールIDを一箇所で定義し、それ以外の箇所からそれらを参照すること。

## コード

- UI状態は effect-atom で、サーバー状態は TanStack Query のみで処理すること。
- 状態を排他的なステータスを持つ判別付きユニオンとして表現し、ブールフラグのセットは使用しないこと。
- ライブラリが提供する型の値を、それらの型そのままで `Schema.decode*` に渡すこと。`unknown` として受け取った場合、コンパイラはライブラリの型と Schema の不一致を検出できなくなる。
- ライブラリがエクスポートする型、スキーマ、列挙型、または定数をコピーしないこと。
- 各宣言に `export const` や `export function` などの `export` を付け、ファイルのエクスポートを `export { … }` のリストにまとめないこと。`from` による再エクスポートは許可される。msch のルール `msch-lint/inline-exports` がこれを強制し、`vp lint --fix` が既存のリストを書き換える。
- 外部API用のクライアントを手動でラップしないこと。以下の順序で選択すること：公式の Effect パッケージ、distilled.cloud（Cloudflare の場合は `@distilled.cloud/cloudflare`）、公開済み OpenAPI からの生成（`@effect/openapi-generator` を使用）。
- 環境変数には、環境ごとに変更される値のみを設定すること。コードや Alchemy の設定で変更されない値、またはツールに設定がある場合はフラグに値を設定すること。環境変数を追加するたびに、どの環境に何を設定するかの考慮事項が追加される。
- Alchemy に不足している設定については、Alchemy をパッチするのではなく、カスタムリソースを定義すること。

## モデルの呼び出し

- APIキーが必要なすべてのモデル呼び出しをCloudflare AI Gateway経由で送信する。Workerの外では、Workers AI Read権限を持つCloudflare APIトークンを使用して、`https://api.cloudflare.com/client/v4/accounts/<account>/ai/v1/chat/completions` のREST APIを呼び出し、`cf-aig-gateway-id` ヘッダーでゲートウェイを指定する。Workerの内部では、`gateway` オプションを指定してAIバインディングを使用する。
- リポジトリ内でOpenRouterや個別のモデルプロバイダーのAPIキーを使用しないこと。ゲートウェイを1つにまとめれば、ログ、キャッシュ、レート制限、課金を一箇所で管理でき、さらにクレデンシャルブローカーがCIにCloudflareトークンをすでに渡している。
- Workers AIモデル（`@cf/...`）を優先する。アカウント上のWorkers AIの利用分として請求される。サードパーティ製モデルにはUnified Billingのクレジットが必要であり、クレジットはオーナーの承認がある場合にのみ購入する。
- ゲートウェイはダッシュボードではなく、Alchemyスタック内で `AI.Gateway` として管理する。公開するライブラリは利用者のために他のプロバイダーへの対応を残してよいが、リポジトリ自体はそれを利用しない。オーナーの長期トークンを利用するClaude Agent SDK経由のClaudeはAPIキーを必要としないため、このルールは適用されない。

## CI

- ワークフローのステップについては、masseater/typescript-template の `.github/actions/` にある複合アクション（verify, autofix, skills-lock, update-branches, credentials, ci-telemetry）を `masseater/typescript-template/.github/actions/<名前>@<sha>` として参照すること。ステップが各リポジトリにコピーされる場合、すべての修正は各リポジトリの書き換えを意味する。renovate は sha を bump する。
- ワークフローは薄く保つこと。ステップは、ピン留めしたアクションや複合アクションの `uses:` か、`vp run <task>` や `vp exec <bin>` といった 1 つのコマンドの `run:` のいずれかにする。ロジックは Vite+ のタスクに記述すること。ワークフローにワークスペースの名前を書かないこと。すべてのワークスペースに同じ名前のタスクを持たせて `vp run -r <task>` で実行し、ワークスペースの順序はそれぞれの `vite.config.ts` の `dependsOn` に書くこと。ワークスペースを追加・削除しても、ワークフローが変わってはならない。複数のコマンドを実行するステップや、ワークスペースの名前を書いたワークフローがあると、msch が `vp run verify` を失敗させる。
- main への push で動く job は、後の push が同じ仕事をやり直すので、最新のコミットの分だけ動けばよい。こうした job には job の `concurrency` に `cancel-in-progress: true` を付け、新しい push が古い run を取り消すようにする。ワークフロー全体の `concurrency` で取り消すと走っているデプロイまで止まるので、job ごとに付ける。デプロイとリリースの job は途中で止めると半端な状態が残るので `cancel-in-progress` を付けず、待っている古い run だけを新しい run に置き換えさせる。`queue: max` は古い run から 1 本ずつ通し、push が続くと run が何時間も積み上がるので付けない。concurrency に `queue` があると、msch が `vp run verify` を失敗させる。
- リポジトリ固有のツール（go、weaver、apt の依存関係など）をそのリポジトリの `.github/actions/setup` に配置し、ジョブからは `$/.github/actions/setup` として呼び出すこと。actionlint はまだ `$/` を認識していないため、`.github/actionlint.yaml` のその1ケースのみを無視すること。
- credentials アクションは、credentials.masseater.dev から Cloudflare と Claude のトークンを受け取る。これらを GitHub Secrets に配置しないこと。
- ボットがブランチにプッシュするワークフロー（autofix, skills-lock, update-branches）は、ブローカーが発行した GitHub App トークンでプッシュする。`GITHUB_TOKEN` でプッシュした場合、`pull_request` の `up-to-date` が承認待ちを停止し（action_required）、PR はマージされないままとなる。ブローカーはワークフローのファイル名で権限を付与するため、ボットのワークフローを追加する際は、masseater.dev の `credential-grants.ts` にある `WORKFLOW_GITHUB_GRANTS` にも追加すること。
- ボットの PR は自動マージで開く。main advanced で遅延した PR については、`update-branches.yml` が main を取り込む。
- `.claude/skills` は `.agents/skills` へのリンクであるため、`.agents/skills/.gitkeep` を追跡すること。リンクターゲットがない場合、複合アクションを取り込む際に Actions が失敗する。

## PR とマージ

- PR のレビューや、PR ごとの CI、動作検証、デプロイは行わないこと。main にマージしてデプロイした後に、本番環境で動作を確認すること。
- マージ前にベースを取り込み、ローカルで `vp run verify` を実行し、自身でマージすること。マージしてよいか確認しないこと。
- ルールセットのバイパスや `--admin` は使用しないこと。
- `verify` を手動で実行して、release-please のリリース PR を再作成すること。手動で実行すると App のトークンで PR が作成されるため、`up-to-date` は承認なしで実行される。

## 脆弱性

- 警告を含め、ZAP アラートを直ちに修正すること。`.github/zap/rules.tsv` には誤検知のみを記述すること。
- `audit` は `vp pm audit --fix` で修正すること。`audit.ignore` には固定バージョンのないアドバイザリのみを記述し、その理由をコミットメッセージに記載すること。

## スキル

- 編集前に、リポジトリルートで `vp exec intent list` を実行すること。スキルが適合する場合は `vp exec intent load <package>#<skill>` で読み込むこと。`intent` が利用できない場合はインストールせず、ギャップを報告すること。
- 複数のリポジトリで使用されている独自のスキルを masseater/skills に配置し、skills CLI でインストールすること。

## セッションの開始

ユーザーとやり取りするセッションを開始する際、テンプレートの更新確認を求められた場合は、まずその処理を完了させ、その後引数なしで `/loop` を開始すること。その内容はリポジトリの `.claude/loop.md` にある。

## 参考文献

適用対象のリポジトリでは、以下も参照すること。

- [`fsd`](references/fsd.md)。Feature-Sliced Design のスライスの分け方、パブリック API、コロケーション、列挙で合わせないためのルール。
- [`cloudflare`](references/cloudflare.md)。Cloudflare にデプロイするリポジトリ向けのルール。
- [`oxlint-plugin-decision`](references/oxlint-plugin-decision.md)。`vp check` で判定ルールを使用するリポジトリ向けのルール。
- [`instrumentation`](references/instrumentation.md)。スパン、CI 計測、および Web Vitals 向けのルール。Workers のトレースでは `@r_masseater/workers-tracing` を、テストでのテレメトリ確認では `@r_masseater/vitest-otlp` を、Web Vitals では `@r_masseater/web-vitals-flow` を使用する。

## ユースケース

- [`publish-npm-package`](usecases/publish-npm-package.md)。パッケージを npm に公開する。
- [`sweep-repeated-corrections`](usecases/sweep-repeated-corrections.md)。毎日、すべてのリポジトリから、どのチェックにも引っかからない指摘を見つけ出し、修正して、チェックへと落とし込む。
- [`land-parallel-prs`](usecases/land-parallel-prs.md)。複数のスレッドが同じリポジトリに出した PR を、verify のやり直しと衝突の解き直しを繰り返さずに main へ入れる。
