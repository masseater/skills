# Web Vitalsの測定

`web-vitals-flow` は [Lighthouse ユーザーフロー](https://github.com/GoogleChrome/lighthouse/blob/main/docs/user-flows.md) を用いて Chrome を駆動する。各 URL に対してナビゲーションを記録する。その後、ページ内の同一オリジンリンクのクリックにかかる時間スパンを記録する。Lighthouse で INP を測定するのは時間スパンのみであるため、INP はこれらのリンク遷移から得られる。

```sh
vp dlx @r_masseater/web-vitals-flow https://example.com/
```

デプロイ後のジョブで、デプロイ済みの本番用 URL を測定する。

このフローはデフォルトで 5 回実行され、各ステップはその中央値で判定される。これは Lighthouse の [変動性に関するガイダンス](https://github.com/GoogleChrome/lighthouse/blob/main/docs/variability.md) に準拠している。CI ランナーの CPU 負荷は変動が大きいため、1 回の実行は測定値とはならない。

ステップの LCP、INP、または CLS の中央値が 0.9 未満の場合、コマンドは失敗する。これが Lighthouse の合格スコアとなる。FCP、TTFB、TBT が表示されるが、これらはコマンドの失敗を意味するものではない。

各実行時には、`--report-dir` に `flow-<run>.html` と `flow-<run>.json` を書き込む。デフォルトは `report` である。レポートは CI アーティファクトとして保持する。

サンドボックス化されたコンテナでは、`--chrome-flags="--no-sandbox"` などの Chrome フラグを渡す。プロキシの背後でも `--proxy-server=$HTTPS_PROXY` を渡す。Chrome が見つからない場合は `CHROME_PATH` を設定する。

このコマンドは、`web-vitals.flow`、`web-vitals.load`、`web-vitals.transition`、`web-vitals.audit`、および `web-vitals.judge` のスパンを出力する。これは `OTEL_TRACES_EXPORTER=otlp` かつエンドポイントが設定されている場合に行われる。`web-vitals.judge` は合格スコアに届かなかったメトリクスを `failures` に列挙し、いずれかが失敗した場合はエラーとなる。

ラボデータはフィールドデータを置き換えるものではない。実際の訪問者がどのような体験をするかについては、ページを提供しているプラットフォームのアナリティクスを利用する。Cloudflare Web Analytics がその一例である。
