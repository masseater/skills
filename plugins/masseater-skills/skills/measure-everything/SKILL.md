---
name: measure-everything
description: 何かを構築または修正する前に、どのように測定するかを決めておく。トレース、メトリクス、ログを追加する際、テレメトリが実際にプロセスから抜けているかを確認する際、Web Vitalsやページ遷移を測定する際、CIのタイミングを調整する際、あるいはカスタム測定コードを記述しようとする際などに活用する。
---

# measure-everything

## このスキルが存在する理由と、その目指すべき状態

このスキルが存在するのは、エージェントが本番環境でコードの動作を確認できないためである。推測で穴を埋め、次のステップでは推測が事実と同じに見える。また、エージェントは独自のタイマーやラッパー、ログ行を記述する傾向がある。これらは作成者が考えた内容を測定するにとどまっている。コードから乖離し、人々がすでに読んでいるツールに辿り着くことはない。

このスキルが目指す状態とは、あらゆる意思決定が測定に基づいて行われることである。測定は、ソフトウェアが実際に動作する場で行われる。公式機能や使用中のツールの自動計測によってそれが収集される。これにより、測定はコード自体の動きに追従する。

## ルール

実装や修正を行う前に測定せよ。まず、どの測定によって問題が解決するかを決める。次にそれを実行し、その結果のみで判断せよ。

パフォーマンス重視の作業では、まず測定可能にする。変更を加える前に、時間がどこに、何に費やされたかを記録し、その数値に基づいて最適化を行う。

機能を構築する前に、自らデバッグできるか確認せよ。再現手段、ログやスパン、およびそれらを読み込むためのパスが必要である。

本番環境、あるいはそれに適合することが実証されているステージング環境で測定せよ。ローカルマシンやテストによる数値だけでは、判断の根拠にはならない。

時間やコストがかかるものはすべてスパン化せよ。これには、アウトバウンドリクエスト、モデル呼び出し、子プロセス、およびファイルI/Oが含まれる。スパンは、実際に時間を要するコード内に配置せよ。単に時間を計るためだけにコマンドやプロセスをラップしてはならない。

既定では自動で計装する。スパンとメトリクスは、自動計装、プラットフォーム、`Effect.fn`、またはエンジンやフレームワークの境界に置いた一つのラッパー（各リントルールや各リクエストハンドラなど、実行されるすべてのユニットをカバーするもの）から取得する。個別の関数にスパンを手動で配置してはならない。

テレメトリを送信するバックエンドがない場合は、ファイルに書き込むこと。ファイルエクスポーターを使用して、`127.0.0.1:4318` で OpenTelemetry Collector を実行すること。テレメトリを受信するためだけの Worker やその他のホスト型レシーバーは構築しないこと。コストがかかるためである。

手段を以下の順序で選定せよ。

1. プラットフォームやライブラリの公式機能、または自動計測。
2. すでにそれを実現している既存のツール。
3. masseater.dev の `@r_masseater/*` 計測パッケージ。最初の2つで不足している部分のみを補完する。
4. 自身のコード。何を検索し、なぜ適合しなかったのかをコミットメッセージに記述せよ。

エクスポーターを標準の `OTEL_*` 環境変数で設定せよ。設定された場合にのみ送信し、エンドポイントをハードコードしてはならない。

テストで測定値を確認できる場合は、そのテストを記述せよ。エクスポートをサイレントに停止させる自動計測はリグレッションである。

## どの手段を使うか

Node.jsプロセスのトレース、メトリクス、ログには、[OpenTelemetry ゼロコード計測](https://opentelemetry.io/docs/zero-code/js/)を使用すること。これは `@opentelemetry/auto-instrumentations-node/register` プリロードであり、`OTEL_*` で設定される。

Effect プログラムでは、`Effect.fn` および `Effect.withSpan` を使用すること。これらを `effect/observability` から `OtlpTracer.layerFromConfig` でエクスポートせよ。

Cloudflare では、プラットフォームに標準で備わっている計測機能を使用すること。ワーカートレーシング、ワーカーログ、D1クエリアナリティクスが主要なニーズを満たす。これらを追加する前に、[cloudflare.md](references/cloudflare.md) を参照せよ。

Vitest の実行期間中は、[`experimental.openTelemetry`](https://vitest.dev/guide/open-telemetry) を有効にせよ。各テストはスパンとなり、テスト内で作成されたスパンはトレースに結合される。

Playwright テストでは、[Playwright OpenTelemetry](https://endform.dev/blog/introducing-playwright-opentelemetry) を使用すること。テストとそのステップはスパンとなり、トレースのコンテキストはブラウザのリクエストを通じてアプリに到達する。

AI Gateway 経由のモデル呼び出しでは、ゲートウェイに OpenTelemetry エクスポーター（`AI.Gateway` の `otel`。[OpenTelemetry](https://developers.cloudflare.com/ai-gateway/observability/otel-integration/) を参照）を設定せよ。これにより、各呼び出しのモデル、トークン、コスト見積もり、レイテンシが、コード変更なしに OTLP 経由で送信される。

Claude Code セッションでは、設定で通常の `OTEL_*` 変数を用いて `CLAUDE_CODE_ENABLE_TELEMETRY=1` を設定せよ。[モニタリングガイド](https://code.claude.com/docs/en/monitoring-usage) に記載されている通り、メトリクスとイベントがエクスポートされる。トレースはベータ版であり、`CLAUDE_CODE_ENHANCED_TELEMETRY_BETA=1` も必要である。

Fly.io では、管理対象の Prometheus から [組み込みメトリクス](https://fly.io/docs/monitoring/metrics/) を読み出せ。管理対象の Grafana には、それら用のダッシュボードが既に用意されている。

テレメトリがセマンティック規約に従っているかを確認するには、CI で [OpenTelemetry Weaver](https://opentelemetry.io/blog/2025/otel-weaver/) のライブチェックを実行せよ。違反が検出された場合は 1 で終了する。テレメトリをエクスポートするテストでも、同様のチェックを実行できる。`@r_masseater/vitest-otlp` の `otlp()` に `semconv: true` を渡せ。

公開済みパッケージのサイズについては、[size-limit](https://github.com/ai/size-limit) を使用すること。制限値を現在のサイズに設定すれば、サイズが増加しても失敗し、その理由がコミットメッセージに反映される。

テストでテレメトリが実際にエクスポートされたことを判定するには、[`@r_masseater/vitest-otlp`](https://github.com/masseater/masseater.dev/tree/main/libs/vitest-otlp) を使用すること。

Worker の自動スパンをテストするには、Miniflare で `@r_masseater/vitest-otlp/workers` の `tailWorker()` を指定して実行せよ。

Web Vitals のページ読み込みや同一オリジンリンクの遷移には、[`@r_masseater/web-vitals-flow`](https://github.com/masseater/masseater.dev/tree/main/libs/web-vitals-flow) を使用すること。実行する前に [web-vitals.md](references/web-vitals.md) を読んでおくこと。

GitHub Actions のワークフロー、ジョブ、ステップの所要時間には、[otel-cicd-action](https://github.com/corentinmusard/otel-cicd-action) を使用すること。追加する前に [ci.md](references/ci.md) を読んでおくこと。
