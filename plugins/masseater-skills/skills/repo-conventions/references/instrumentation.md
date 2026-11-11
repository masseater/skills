# 計装

計測で判断する手順は measure-dont-guess に従う。ここには、計れる状態を作る決まりを置く。

- 機能開発の前に、AI が自分でデバッグできる仕組みを作る。再現手段、ログやスパン、それを読む経路の 3 つである
- 時間かお金を使う処理はすべてスパンにする。外部 API やモデルへのリクエスト、子プロセス、ファイルの入出力がこれにあたる
- Cloudflare Workers では、Effect のスパン、TanStack Start のリクエストとサーバー関数、Elysia のルートを `@r_masseater/workers-tracing` で Workers のトレースに出す
- Workers 以外のプロセスは `OtlpTracer.layerFromConfig` で出す。Effect は `OTEL_TRACES_EXPORTER=otlp` と `OTEL_EXPORTER_OTLP_ENDPOINT` が設定されたときだけ送る
- コードが実際に出したスパン・メトリクス・ログをテストで確かめるときは、`@r_masseater/vitest-otlp` でテストファイルごとに OTLP の受け口を立てる
- スパンは時間を使っている処理そのものに仕込む。計測のためだけにコマンドやプロセスを包まない
- GitHub Actions のワークフローの最後には `.github/scripts/ci-telemetry.sh` を動かすジョブを置く

## Web Vitals

- Web Vitals（LCP・INP・CLS・FCP・TTFB・TBT）は、`@r_masseater/web-vitals-flow` を入れた `tools/web-vitals` で `vp run measure <URL>...` を実行して測る。各 URL の読み込みと、そのページの同じオリジンのリンクを押した遷移を Lighthouse の user flow で 5 回測り、`report/` に回ごとの flow-<回>.html と flow-<回>.json を書く。各ステップの中央値で LCP・INP・CLS のどれかが Lighthouse の合格点（0.9）に届かなければ失敗する
- main の verify はデプロイの後に `vars.ZAP_TARGET_URL` の本番を測り、レポートを Actions の成果物に残す
- クラウドのセッションでは `--chrome-flags="--no-sandbox --proxy-server=$HTTPS_PROXY"` を付ける。Chrome は session-start フックが `CHROME_PATH` で渡す
