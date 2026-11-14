# CIの計測

すべてのワークフローを [otel-cicd-action](https://github.com/corentinmusard/otel-cicd-action) でトレースとして送信する。ジョブとステップは子スパンとなる。アクションは事後的に GitHub API から実行を読み込むため、ステップはラップされない。

他のあらゆるジョブを`必要`とする最後のジョブに配置する。そのジョブを`always()`で実行し、失敗やキャンセルされた実行も計測されるようにする。`actions: read`のみを付与する。

エンドポイントをリポジトリ変数 `OTEL_EXPORTER_OTLP_ENDPOINT` として渡す。ヘッダーをシークレット `OTEL_EXPORTER_OTLP_HEADERS` として渡す。変数が設定されていない場合はジョブをスキップし、フォークや新しいリポジトリがグリーンのままになるようにする。アクションをコミットSHAにピン留めする。以下の例では v4.2.0 をピン留めしている。

```yaml
ci-telemetry:
  needs: [verify, deploy]
  if: always() && vars.OTEL_EXPORTER_OTLP_ENDPOINT != ''
  runs-on: ubuntu-latest
  permissions:
    actions: read
  steps:
    - uses: corentinmusard/otel-cicd-action@4826b79d63662fa91657272e7711420cb6aea543
      with:
        otlpEndpoint: ${{ vars.OTEL_EXPORTER_OTLP_ENDPOINT }}
        otlpHeaders: ${{ secrets.OTEL_EXPORTER_OTLP_HEADERS }}
        otelServiceName: ${{ github.repository }}
        githubToken: ${{ github.token }}
```

テストスイートや `web-vitals-flow` など、一部のステップは OpenTelemetry 自体を出力する。これらにも同じ `OTEL_*` 変数を指定する。すると、それらのスパンはワークフロートレースの隣に配置される。
