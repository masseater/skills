# pricing-traps

2026-10-27 に [Workers の料金ページ](https://developers.cloudflare.com/workers/platform/pricing/) などで確かめた単価と、課金の仕組みである。単価は変わるので、見積もりに使う前に料金ページで確かめる。

## 課金される単位

| 対象 | 課金の単位 | Paid の含まれる量と超過分 |
| --- | --- | --- |
| Workers | リクエストと CPU 時間 | 月 1,000 万リクエスト、超過は 100 万あたり $0.30。CPU は月 3,000 万 ms、超過は 100 万 ms あたり $0.02 |
| 静的アセット | 課金されない | Worker を起動しない限り無料 |
| KV | 読み取り・書き込み・削除・list | 読み取りは 100 万あたり $0.50、書き込み・削除・list は 100 万あたり $5.00 |
| D1 | 読んだ行と書いた行 | 書き込みは月 5,000 万行、超過は 100 万行あたり $1.00。読み取りは 100 万行あたり $0.001 |
| Durable Objects | リクエスト、起きている時間（GB 秒）、行 | 時間は 128 MB 分が使用量によらず課金される。眠っている間は課金されない |
| Queues | 操作 | 64 KB ごとの分割と再試行もそれぞれ 1 操作に数える |
| R2 | Class A・Class B の操作と保存量 | 外への転送は無料。マルチパートのアップロードは部品ごとに Class A |
| Workers Logs | ログのイベント | 2026-12-01 から [Cloudflare Observability の料金](https://developers.cloudflare.com/observability/pricing/)（取り込み GB と保存 GB 月）に変わる |
| Workers Logpush | リクエスト | 月 1,000 万、超過は 100 万あたり $0.05 |

## 上限が無いこと

- アカウントの支出を止める設定は無い。[予算アラート](https://developers.cloudflare.com/billing/manage/optimize-costs/)は通知だけである
- 1 回の実行の暴走を止める公式の手段は、[Custom limits](https://developers.cloudflare.com/workers/platform/pricing/) の `limits.cpu_ms` である

## Rate Limiting バインディングの効き方

[Rate Limiting バインディング](https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/)は拠点ごとの近似で、上限ちょうどでは止まらない。2026-10-27 に typescript-template の本番で、1 分 100 回の設定に 1 つの IP から送って測った。

- 600 回を約 1 分で送ったときは、1 回も 429 にならなかった
- 3,000 回を 24 秒で送ったときは、1,852 回が 429 になり、1,148 回が通った

大量アクセスで請求が跳ねるのは防げるが、上限を正確に守らせる用途には使えない。正確な上限が要るときは、WAF のレート制限ルールか Durable Object のカウンターを使う。

## 静的アセットと Worker

- 静的アセットに一致するリクエストは、既定では [Worker を起動せずに配られる](https://developers.cloudflare.com/workers/static-assets/)
- `assets.run_worker_first = true` にすると全リクエストで Worker が起動して課金される。配列で必要なパスだけに絞れる
- 互換性フラグ `assets_navigation_prefers_asset_serving`（2025-04-01 以降の互換日付で既定）が有効なら、ナビゲーションのフォールバックも Worker を起動しない
