# 測定する観点

2026-11-28 に確認した値である。上限は変わるので、数値を根拠にする前にリンク先のページを読み直すこと。

各判断について、その行の観点を取る。それぞれを測定するか、変わらないことと、それを示す測定値を書き留める。

| 判断 | 観点 |
| --- | --- |
| リポジトリ、パッケージ、アプリの分割や統合 | 時間、メモリ、ストレージ、キャッシュ、ネットワーク、失敗率、変更頻度、認知負荷 |
| CI を速くする | 時間、キャッシュ、ネットワーク、メモリ、ストレージ、失敗率、コスト |
| コストを下げる | コストとそれを決める使用量、ネットワーク、ストレージ |
| アプリやページを速くする | 時間、メモリ、ネットワーク、ストレージ、失敗率 |
| 依存やツールを選ぶ | 時間、メモリ、ストレージ、ネットワーク、失敗率、変更頻度、認知負荷 |
| クラウドセッション、フック、コマンドの動作を変える | 時間、メモリ、ストレージ、ネットワーク、失敗率 |

時間とコストは選択肢の間で比べる。メモリ、ストレージ、キャッシュ、ネットワークには上限もあり、超えると遅くなるのではなく失敗するか追い出されるので、各値を上限と照らし合わせ、余裕も記録すること。

## 時間

- 合計だけでなく、時間がどこに使われているかを測定する。
- CI：`work-metrics ci --repo <owner/name> --days <n> --out <dir>` は、待ち時間（queued）、ジョブ、ステップ、composite action、vp タスクごとの時間を出力する。
- ローカルのコマンド：`lap <name> -- <command>` で実行し、`work-metrics spans --dir ~/.cache/lap/<run>` で読む。
- テスト：`lapse()` は Collector が待ち受けている間だけ Vitest のスパンを有効にする。実行時間が約 11% 増えるためである。
- PR を開いてからマージまで：`work-metrics pull-requests` が、キュー、CI、再実行、マージキューからの除外に分けて出力する。
- 本番環境：サーバーは Workers tracing、ページは `web-vitals-flow` で測る。
- クラウドセッションの上限：フォアグラウンドのコマンドは既定で 2 分、最大で 10 分待つ。約 5 分より長いセットアップスクリプトはキャッシュされない（[クラウド環境](https://code.claude.com/docs/en/cloud-environments)）。

## メモリ

- コマンドの実行中のマシン全体のピークを測定する。`lap` と CI のセットアップアクションが起動する Collector は、5 秒ごとに `system.memory.usage` をトレースの隣の `metrics.jsonl` に書く。`@r_masseater/vitest-otlp/collector-files` の `metricsInFile` で読む。
- クラウドセッションのメモリは約 16 GB で、それを大きく超えるメモリを要するタスクは VM に停止されることがある（[クラウド環境](https://code.claude.com/docs/en/cloud-environments)）。
- 公開リポジトリの GitHub ホスト型ランナーは 4 vCPU、16 GB の RAM、14 GB の SSD で、プライベートリポジトリのランナーはこれより小さい（[ランナーの表](https://docs.github.com/en/actions/reference/runners/github-hosted-runners)）。
- Worker の isolate は 128 MB で、超えたリクエストはエラー 1102 で終了する（[Workers の制限](https://developers.cloudflare.com/workers/platform/limits/)）。

## ストレージ

- 作業が足して残すものを測定する。チェックアウト、依存のストア、ビルドの出力、キャッシュである。コマンドの前後で、それぞれのディレクトリに `du -sh` を実行する。クラウドセッションの `df` は、そのセッションの割り当てを示さない。
- クラウドセッションのディスクは約 30 GB である（[クラウド環境](https://code.claude.com/docs/en/cloud-environments)）。
- GitHub ホスト型ランナーの SSD は 14 GB である（[ランナーの表](https://docs.github.com/en/actions/reference/runners/github-hosted-runners)）。

## キャッシュ

- サイズとヒット率を別々に測定する。サイズは何が追い出されるかを決め、ヒット率はキャッシュが何を節約するかを決める。
- Actions のキャッシュ：`gh cache list --json key,ref,sizeInBytes,lastAccessedAt`、または `GET /repos/{owner}/{repo}/actions/cache/usage` の `active_caches_size_in_bytes`（約 5 分遅れる）で測る（[REST API](https://docs.github.com/en/rest/actions/cache)）。
- Vite Task のキャッシュ：`vp run --last-details` が、タスクごとのヒットとミス、変わった入力を示す。
- 復元と保存のステップの所要時間は `work-metrics ci` から取る。
- Actions のキャッシュは、リポジトリあたり 10 GB、保持期間 7 日が上限で、上限を超えると古いエントリから追い出される。上限を上げると 1 GiB あたり月 0.07 ドルかかる（[変更履歴](https://github.blog/changelog/2025-11-20-github-actions-cache-size-can-now-exceed-10-gb-per-repository/)）。

## ネットワーク

- 実行ごとのバイト数とリクエスト数、インストールやキャッシュの復元といったダウンロードのステップごとの所要時間（`work-metrics ci`）を測定する。
- Node.js プロセスの外向きのリクエストは OpenTelemetry のゼロコード計装から、Worker のサブリクエストは Workers tracing から取る。
- クラウドセッションは、ネットワークポリシーが許可したホストにしか届かない（[クラウド環境](https://code.claude.com/docs/en/cloud-environments)）。
- Paid プランの Worker は、1 リクエストあたり 10,000 件までサブリクエストを行える（[Workers の制限](https://developers.cloudflare.com/workers/platform/limits/)）。

## コスト

- リクエスト数、書き込んだ行数、トークン数、ランナーの分数など、コストを決める使用量を測定し、単価を掛ける。今測った使用量を、設計が想定する規模まで外挿できる。
- Cloudflare：`work-metrics cloudflare --days <n>` が、リソースとメーターごとの使用量を出力する。
- モデル：AI Gateway の OpenTelemetry エクスポートが、呼び出しごとのトークン数とコストの見積もりを運ぶ。Claude Code のセッションは `claude_code.cost.usage` を書き、`work-metrics claude --dir <dir>` がセッションごとのトークン数、コスト、ツールの失敗を合計する。
- 従量課金の使用量を増やす機能は、Workers Paid プランに含まれる範囲に収める。1 日 0.10 ドルを超えるなら、オーナーの承認が要る。

## 失敗率

- 多数の実行にわたって失敗を測定し、それぞれを失敗したジョブ、ステップ、依存、ツールに帰属させる。1 回の実行からは、不安定さは分からない。
- 失敗や中止を含む CI の実行：`work-metrics ci`。チェックの再実行とマージキューからの除外：`work-metrics pull-requests`。
- Claude の API エラーとツールの失敗：`work-metrics claude --dir <dir>`。
- 本番環境：Workers Issues が、捕捉されなかった例外、5xx レスポンス、ログに記録されたエラーをまとめる。

## 変更頻度

- どれだけ頻繁に変わるか、どのファイルがまとめて変わるかを測定する。対象のパスに `git log --since=<date> --name-only` を実行し、複数のリポジトリにまたがる PR の件数を数える。
- 他の変更が引き起こす変更は、`work-metrics pull-requests` のブランチの更新とマージキューからの除外に現れる。
- 依存は、リリース履歴からリリースの頻度と破壊的変更を読む。

## 認知負荷

- オーナーが読む量、覚えておく量、手で打つ量、決める量を測定する。タスクごとにオーナー宛てに出したメッセージとカードの数、1 つの変更で一緒に変えなければならない箇所の数、手で打つコマンドの数である。
- スレッドと差分から数える。結果の感触から見積もらないこと。
