# Cloudflareでの計測

`observability.traces.enabled` で [Workers tracing](https://developers.cloudflare.com/workers/observability/traces/) を有効にする。すると、Cloudflare がアウトバウンドフェッチおよび KV、R2、D1、Durable Objects、その他の Worker への呼び出し用のスパンを作成する。SDKは不要である。

`observability.issues.enabled` で [Workers Issues](https://developers.cloudflare.com/workers/observability/issues/) を有効にする。これにより、捕捉されなかった例外、5xx レスポンス、およびログに記録されたエラーが issue にまとめられ、本番環境での障害が報告前に記録される。デフォルトでは無効になっており、有効にした後のみトラフィックが記録される。`console.error()` で処理済みのエラーをログに記録し、issue として扱う。

Effect、TanStack Start、および Elysia のアプリでは、[`@r_masseater/workers-tracing`](github:masseater/masseater.dev/libs/workers-tracing) を追加する。これにより、Effect のスパン、リクエスト、サーバー関数、および Elysia ルートが、プラットフォーム独自のスパンに統合されて 1 つのトレースとなる。リポジトリごとに Effect トレーサーやスパンミドルウェアをビルドしてはならない。

Alchemy スタックでは、プロバイダーに `withWorkersTracing({ destinations })` を渡し、これにより Issues も有効になる。各 Worker に `observability` と互換性日を記述してはならない。後から追加された Worker は、誰も忘れずにトレースされる。すべての Effect を `run` または `runner` で実行し、そこから `Elysia` をインポートする。トレースをスキップするコードがリントに失敗するよう、oxlint プリセットを追加しておく。

CI でスパンを確認するには、アカウントごとに一度だけ `traceSink` をデプロイする。その後、デプロイのたびに `workers-traces --request <url> --expect <span> --wait <seconds>` を実行する。到達しなくなったスパンは、デプロイジョブに失敗する。

トレースとログを [export destinations](https://developers.cloudflare.com/workers/observability/exporting-opentelemetry-data) 経由で OTLP バックエンドに送信する。ダッシュボードのシグナルごとに 1 つの宛先を作成し、Worker の設定で名前を付ける。エクスポートには有料の Workers プランが必要であり、メトリクスはまだエクスポートできない。ダッシュボードにコピーを残さずに送信するには、`persist: false` を設定する。

Worker スパンのタイミングを慎重に確認すること。ランタイムがクロックを進めるのは I/O 時のみであるため、一部のスパンでは持続時間が 0 と表示される。サービスバインディングや Durable オブジェクトへの呼び出しでは、個別のトレースが開始される。

D1 については、[GraphQL Analytics API](https://developers.cloudflare.com/d1/observability/metrics-analytics) をクエリする。`d1QueriesAdaptiveGroups` には、クエリの時刻、読み取り行数、書き込み行数が一覧表示される。`wrangler d1 insights` は、コマンドラインから同じデータをランク付けする。このコマンドは実験的なため、オプションが変更される可能性がある。

実際の訪問者がどのような体験をするかについては、Cloudflare Web Analytics を使用する。
