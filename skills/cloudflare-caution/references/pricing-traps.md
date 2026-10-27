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

## 静的アセットと Worker

- 静的アセットに一致するリクエストは、既定では [Worker を起動せずに配られる](https://developers.cloudflare.com/workers/static-assets/)
- `assets.run_worker_first = true` にすると全リクエストで Worker が起動して課金される。配列で必要なパスだけに絞れる
- 互換性フラグ `assets_navigation_prefers_asset_serving`（2025-04-01 以降の互換日付で既定）が有効なら、ナビゲーションのフォールバックも Worker を起動しない

## 高額請求の例

[PPC Land の記事](https://ppc.land/developer-faces-36-000-cloudflare-bill-after-queue-loop-post-says/)（2026-10-06）による。数字は投稿者の申告で、記事自身も合計が合わないと書いている。

- 内部の呼び出しが非同期書き込みのフラグを引き継ぎ、書き込みのたびに Queue へ 5〜10 回再投入されていた
- 1 回の書き込みで `storage.put()` をまとめずに 12 回呼んでいた
- 認証の分岐で、ほとんどのリクエストが `kv.list()` を呼んでいた
- リクエストの多くはボットで、レート制限がつながっていなかった
- 内訳は KV の書き込み 31 億回、読み取り 166 億回、DO の行の書き込み 40 億行など

同じ記事は、Durable Object の alarm のループで 8 日に 3.4 万ドル、D1 の書き込みループで月 5 ドルが 4,868 ドルになった例にも触れている。
