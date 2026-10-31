---
name: cloudflare-caution
description: Cloudflare で請求が膨らむ設計を避け、安く済む形を選ぶ。Cloudflare に載せるものを設計するとき、Worker やバインディングを足すとき、ページやデータの配り方を決めるとき、ループや再試行を書くときに使う。
metadata:
  derived-from: https://github.com/anantbhandarkar/make-it-right/blob/1e20457d47d6cf4658b131c29204a9a4d1c1d91d/skills/mir-cloud-cloudflare/SKILL.md
---

# cloudflare-caution

- 結果が同じになる処理を、リクエストのたびに動かさない
- 暴走したときに止まる仕組みを、コードと設定に入れる
- 課金される単位で費用を見積もり、本番の使用量で確かめる

## この skill が必要な理由と達成したい状態

この skill が必要な理由は、Cloudflare の課金が細かい単位の従量で、支出に上限が無いことにある。1 回あたりは安いので書いている時点では気にならないが、閲覧のたびに動く処理や、ループと再試行のバグは、その回数がそのまま請求になる。

この skill で達成したい状態は、1 回のアクセスにかかる費用が設計の段階で決まっていることである。バグやボットで想定を外れても、請求になる前にコードと設定が止める。

## 同じ結果の作り置き

閲覧のたびに同じものを作り直すと、Worker の起動、CPU 時間、DB の行がアクセス数に比例して課金される。作り置けるものは作り置いて配る。

- 誰が見ても同じ公開ページの配り方は、project-checklist に従う
- CSP の nonce を使うと、HTML をリクエストごとに作ることになる。公開の静的ページでは nonce に頼らず、inline の script を外部ファイルに出して、全ページ共通の CSP を `_headers` で付ける。ページごとのハッシュを `_headers` に並べる形は、ルール数の上限（100）でいずれ破綻する
- 静的アセットに一致するリクエストは、既定では [Worker を起動せずに配られる](https://developers.cloudflare.com/workers/static-assets/)ので課金されない。互換性フラグ `assets_navigation_prefers_asset_serving`（2025-04-01 以降の互換日付で既定）が有効なら、ナビゲーションのフォールバックも Worker を起動しない
- `assets.run_worker_first` は、配列で認証や API のパスだけに絞る。`true` にすると、静的アセットへのリクエストもすべて Worker の課金に変わる
- 閲覧者ごとに変わる部分だけを動的にする。ページ全体を動的にしない
- 動的なデータは、変わる頻度に合わせて CDN のキャッシュ、Cache API、KV に置く。リクエストのたびに D1 や外部 API を呼ばない
- クライアントでは、データが変わらない間は再取得しない。TanStack Query なら `staleTime` を設定する

## 暴走の歯止め

- Worker には [Custom limits](https://developers.cloudflare.com/workers/platform/pricing/) の `limits.cpu_ms` を付ける。1 回の実行の暴走を止める公式の手段はこれだけである。値は本番の CPU 時間の p99 を測って、その少し上にする。上限まで上げると、無限ループがそのまま請求になる
- 公開する API、認証、書き込みの口の前段には、レート制限を置く。ボットの大量アクセスは、レート制限が無ければすべて課金される
- レート制限は、ゾーンを持つリポでは WAF のレート制限ルールで、持たないリポでは Workers の [Rate Limiting バインディング](https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/)で掛ける。バインディングは拠点ごとの近似で、上限を超えても止まらないことがある。正確な上限が要るときは、WAF のレート制限ルールか Durable Object のカウンターを使う
- Queue の consumer、Durable Object の alarm、再試行の処理は冪等にする。自分自身を再投入しない
- 再投入と再試行には回数の上限を付ける
- アカウントに[予算アラート](https://developers.cloudflare.com/billing/manage/optimize-costs/)を設定する。止めるためではなく、早く気づくためである

## 書き込みと操作の削減

書き込みと一覧の操作は、読み取りより 1 桁から 3 桁高い。

- KV の書き込み、D1 と Durable Objects の行の書き込みは、まとめて書く
- 値が変わっていなければ書かない
- KV の `list()` をリクエストのたびに呼ばない。キーで直接引けるように設計する
- Durable Object は、WebSocket Hibernation と alarm を使って眠らせる。起きている間は、使っていなくても 128 MB 分の時間が課金される
- Durable Object を `setTimeout` や外向きの接続で起こしたままにしない
- R2 の Infrequent Access は、書き込みや読み取りの多い小さいファイルに使わない。操作の単価が Standard より高い

## ログとトレースの間引き

ログもトレースも、量に応じて課金される。

- 全リクエストのログを Cloudflare に保存し続けない。必要な量だけを `head_sampling_rate` でサンプリングする
- 外部へ送るだけなら `persist: false` にする

## 見積もりと本番での確認

measure-dont-guess に従う。

- 設計を決める前に、想定のアクセス数に 1 回あたりの Worker の起動・行・操作・ログの数を掛けて、月額を見積もる
- デプロイの後は、ダッシュボードの Billable Usage か GraphQL Analytics API で本番の使用量を見る。見積もりとずれていれば、設計を見直す

課金の単位と単価は次のとおりである。2026-10-27 に [Workers の料金ページ](https://developers.cloudflare.com/workers/platform/pricing/)などで確認した。単価は変わるので、見積もりに使う前に料金ページで確認する。

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
