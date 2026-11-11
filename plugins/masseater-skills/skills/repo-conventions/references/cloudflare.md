# Cloudflare にデプロイするリポジトリ

費用を抑える設計は cloudflare-caution に従う。

- Workers Paid プランを前提にする。Paid でしか使えない機能や上限を前提に設計してよい
- ゾーンの WAF カスタムルールと Logpush のジョブは、masseater.dev ゾーンの持ち主の masseater/masseater.dev だけが持つ。ほかのリポは持たず、`OWNED_ZONE` は `Option.none()` のままにする。2 つのリポが同じゾーンの設定を持つと、デプロイのたびに互いの設定を上書きするからである
- Worker にはすべて `logpush: true` を付ける
- Bot Fight Mode は使わない
- Cloudflare などのクラウドの認証は Alchemy のプロファイルで管理する
- `APP_NAME` やスタック名を変えると、リソースは作り直される

## 公開の静的ページ

誰にでも見せるページで、リクエストごとに中身が変わらないものは、masseater/typescript-template の `apps/lp` と同じ形で作る。

- TanStack Start のプリレンダーで HTML にし、`main` を渡さない `Website.StaticSite` で静的アセットだけとして配る。Worker の SSR、`runWorkerFirst`、R2 からの配信は使わない
- CSP は nonce に頼らない。`apps/lp/inline-scripts.ts` の Vite プラグインが inline の script を外部ファイルに出し、`security-headers` の `STATIC_PAGE_HEADERS` を `_headers` で付ける

## アクセス解析

Cloudflare Web Analytics を既定で有効にする。

- サイトはホストごとに Cloudflare の API で一度だけ作り、そのトークンを `alchemy.run.ts` の `CF_BEACON_TOKEN` に置く
- CI のトークンに Account Settings Write を足さないため、`Rum.Site` は使わない
- SSR のアプリは、Worker の `CF_BEACON_TOKEN` から `start.ts` が HTML にビーコンを足す。静的ページは、ビルド時の `VITE_CF_BEACON_TOKEN` から root の `head` で入れる。ゾーンの自動挿入は Workers の応答に効かない
