# CI

- ワークフローのステップについては、masseater/typescript-template の `.github/actions/` にある複合アクション（verify, autofix, update-branches, credentials, ci-telemetry）を `masseater/typescript-template/.github/actions/<名前>@<sha>` として参照すること。ステップが各リポジトリにコピーされる場合、すべての修正は各リポジトリの書き換えを意味する。renovate は sha を bump する。
- main への push で動く job は、後の push が同じ仕事をやり直すので、最新のコミットの分だけ動けばよい。こうした job には job の `concurrency` に `cancel-in-progress: true` を付け、新しい push が古い run を取り消すようにする。ワークフロー全体の `concurrency` で取り消すと走っているデプロイまで止まるので、job ごとに付ける。デプロイとリリースの job は途中で止めると半端な状態が残るので `cancel-in-progress` を付けず、待っている古い run だけを新しい run に置き換えさせる。
- リポジトリ固有のツール（go、weaver、apt の依存関係など）をそのリポジトリの `.github/actions/setup` に配置し、ジョブからは `$/.github/actions/setup` として呼び出すこと。actionlint はまだ `$/` を認識していないため、`.github/actionlint.yaml` のその1ケースのみを無視すること。
- credentials アクションは、credentials.masseater.dev から Cloudflare と Claude のトークンを受け取る。これらを GitHub Secrets に配置しないこと。
- ボットがブランチにプッシュするワークフロー（autofix, update-branches）は、ブローカーが発行した GitHub App トークンでプッシュする。`GITHUB_TOKEN` でプッシュした場合、`pull_request` の `up-to-date` が承認待ちを停止し（action_required）、PR はマージされないままとなる。ブローカーはワークフローのファイル名で権限を付与するため、ボットのワークフローを追加する際は、masseater.dev の `credential-grants.ts` にある `WORKFLOW_GITHUB_GRANTS` にも追加すること。
- ボットの PR は自動マージで開く。
- `update-branches.yml` は、自動マージを有効にしたプルリクエストのマージキューである。これは、GitHub のマージキューが組織所有のリポジトリでのみ機能するためである。キューに登録されたプルリクエストが main の最新状態であり、必要なチェックが失敗していない場合、ボットは待機する。そうでない場合は、main から遅れたプルリクエストのうち、最初に自動マージを有効にした1件のみを更新する。main から遅れたすべてのプルリクエストが一斉に更新されると、競り合いになり、チェック速度の遅いプルリクエストが勝利することはない。`up-to-date` が失敗するか、自動マージが有効な状態になると、ブローカーが `pull_request_target` や `workflow_run` にトークンを発行しないため、`workflow_dispatch` を通じてキューが再始動する。スレッドは独自のプルリクエストを最新状態に更新せず、マージを凍結することもない。自動マージを有効にし、順序はキューに任せる。
