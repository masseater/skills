# インストルメンテーション

- 機能開発に先立ち、AIが自律的にデバッグできる仕組みを構築する。これには3つの要素がある：再現手段、ログとスパン、およびそれらを読み込むためのパスである。
- 時間やコストがかかるあらゆる操作をスパン化する。外部APIやモデルへのリクエスト、子プロセス、ファイルI/Oがこれに該当する。
- Cloudflare Workersにおいて、Effectスパン、TanStack Startリクエスト、サーバー関数、およびElysiaが`@r_masseater/workers-tracing`を用いてWorkersへのトレースをルーティングする操作をエクスポートする。
- Workers以外のプロセスについては、`OtlpTracer.layerFromConfig`でエクスポートする。Effectは、`OTEL_TRACES_EXPORTER=otlp`かつ`OTEL_EXPORTER_OTLP_ENDPOINT`が設定されている場合にのみ送信される。
- テストでコードが実際に出力したスパン、メトリクス、ログを確認する際は、`@r_masseater/vitest-otlp`を用いてテストファイルごとにOTLPレシーバーを設定する。
- 実際に時間がかかる操作にスパンを記述する。測定のためだけにコマンドやプロセスをラップしてはならない。
- すべてのGitHub Actionsワークフローの末尾に、ci-telemetry アクションを実行するジョブを配置する。

## Web Vitals

- `@r_masseater/web-vitals-flow`がインストールされている`tools/web-vitals`で`vp run measure <URL>...`を実行し、Web Vitals（LCP、INP、CLS、FCP、TTFB、TBT）を測定する。Lighthouseのユーザーフローを用いて5回測定し、各URLの負荷と、そのページ上の同一オリジンリンクのクリックによる遷移を測定し、実行ごとに`flow-<run>.html`および`flow-<run>.json`を`report/`に書き出す。各ステップの中央値において、LCP、INP、またはCLSのいずれかがLighthouseの合格スコア（0.9）に達しない場合は失敗する。
- main's verifyは、デプロイ後に`vars.ZAP_TARGET_URL`で本番環境の測定を行い、レポートをActionsアーティファクトとして保持する。
- クラウドセッションでは、`--chrome-flags="--no-sandbox --proxy-server=$HTTPS_PROXY"`を追加する。セッション開始フックは、`CHROME_PATH`経由でChromeを通過する。
