---
name: cloudflare-caution
description: Cloudflare（Workers・静的アセット・KV・D1・R2・Durable Objects・Queues・Workers Logs）で請求が膨らむ設計を避け、安く済む形を選ぶ。Cloudflare に載せるものを設計するとき、Worker やバインディングを足すとき、ページやデータの配り方を決めるとき、ループや再試行を書くときに使う。
metadata:
  derived-from: https://github.com/anantbhandarkar/make-it-right/blob/1e20457d47d6cf4658b131c29204a9a4d1c1d91d/skills/mir-cloud-cloudflare/SKILL.md
---

# cloudflare-caution

Cloudflare で請求が膨らまない設計にするための規則である。

- 結果が同じになる処理を、リクエストのたびに動かさない
- 暴走したときに止まる仕組みをコードと設定に入れる
- 課金される単位（リクエスト、CPU 時間、行、操作、ログのイベント）で費用を見積もり、本番の使用量で確かめる

## この skill が必要な理由と達成したい状態

この skill が必要な理由は、Cloudflare の課金がリクエスト、行、操作、ログのイベントといった細かい単位の従量で、しかも支出に上限が無いことにある。どの単位も 1 回あたりは安いので、書いている時点では気にならない。けれど、閲覧のたびに SSR や API や DB を動かす設計では、費用がアクセス数に比例して伸びる。ループや再試行のバグがあれば、その回数がそのまま請求になる。予算アラートは通知するだけで、止めてはくれない。実際に、Queue の再投入ループで 3 万ドルを超える請求が来た例がある（[記事](https://ppc.land/developer-faces-36-000-cloudflare-bill-after-queue-loop-post-says/)）。

この skill で達成したい状態は、1 回のアクセスにかかる費用が設計の段階で決まっていて、バグやボットで想定を外れても、請求になる前にコードと設定が止めることである。

## 同じ結果を毎回作らない

[`pricing-traps`](references/pricing-traps.md) も読むこと。

- 誰が見ても同じ公開ページは、ビルド時にプリレンダーして静的アセットで配る。静的アセットへのリクエストは Worker を起動せず、課金されない
- 静的アセットの前に Worker を挟まない。`assets.run_worker_first` は認証や API のパスだけに絞る
- 動的なデータは、変わる頻度に合わせて CDN のキャッシュ、Cache API、KV に置く。リクエストのたびに D1 や外部 API を呼ばない
- クライアントでデータを取るときは、変わらない間は再取得しない（TanStack Query なら `staleTime` を設定する）
- 閲覧者ごとに変わる部分だけを動的にする。ページ全体を動的にしない

## 暴走を止める

- Worker には `limits.cpu_ms` を付ける。値は本番の CPU 時間の p99 を測ったうえで、その少し上にする。上限まで上げると、バグがそのまま請求になる
- 公開する API、認証、書き込みの口には、前段にレート制限を置く。ゾーンを持つリポでは WAF のレート制限ルールを使い、持たないリポでは Workers の Rate Limiting バインディングを使う
- Queue の consumer、Durable Object の alarm、再試行は冪等にし、自分自身を再投入しない。回数に上限を付ける
- アカウントに予算アラートを設定する。これは止めるためではなく、早く気づくためのものである

## 書き込みと操作を減らす

- KV の書き込みと D1・Durable Objects の行の書き込みは、読み取りよりずっと高い。まとめて書き、変わっていない値は書かない
- KV の `list()` をリクエストのたびに呼ばない。引けるキーを設計する
- Durable Object は、WebSocket Hibernation と alarm を使って眠らせる。`setTimeout` や外向きの接続で起こしたままにしない
- R2 の Infrequent Access は、書き込みや読み取りの多い小さいファイルに使わない

## ログとトレース

- 全リクエストのログを Cloudflare に保存し続けない。ログもトレースも、量に応じて課金される。必要な量だけ `head_sampling_rate` でサンプリングし、外部へ送るだけなら `persist: false` にする

## 見積もりと確かめ方

measure-dont-guess に従う。

- 設計を決める前に、想定のアクセス数に、1 回あたりの Worker の起動・行・操作・ログの数を掛けて月額を見積もる
- デプロイの後は、ダッシュボードの Billable Usage か GraphQL Analytics API で本番の使用量を見て、見積もりとずれていないか確かめる
