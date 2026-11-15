# Cloudflare にデプロイするリポジトリ

コストを抑える設計については、cloudflare-caution に従うこと。

- Workers Paid プランを前提とすること。Paid でのみ利用可能な機能や制限を前提に設計してもよい。
- ゾーンの WAF カスタムルールおよび Logpush ジョブは、masseater.dev ゾーンの所有者である masseater/masseater.dev のみが所有している。他のリポジトリはこれらを所有しておらず、`OWNED_ZONE` を `Option.none()` として残している。2つのリポジトリが同じゾーンの設定を所有している場合、デプロイのたびに互いの設定を上書きする。
- Bot Fight Mode は使用しないこと。
- Alchemy プロファイルを使用して、Cloudflare などのクラウドの認証を管理する。
- `APP_NAME` またはスタック名を変更すると、リソースが再作成される。

## 公開静的ページ

リクエストごとに内容が変更されないすべてのユーザーに表示されるページは、masseater/typescript-template の `apps/lp` と同じ形式で構築される。

- TanStack Start のプリレンダリングを用いて HTML 化し、`main` を渡さずに `Website.StaticSite` のみで静的アセットとして提供する。Worker SSR、`runWorkerFirst`、または R2 からの提供は使用しないこと。
- CSP でノンスに依存しないこと。`apps/lp/inline-scripts.ts` の Vite プラグインはインラインスクリプトを外部ファイルに移動し、`security-headers` の `STATIC_PAGE_HEADERS` は `_headers` でアタッチされる。

## アナリティクス

デフォルトで Cloudflare Web Analytics を有効にする。

- Cloudflare API を使用して、ホストごとに一度だけサイトを作成し、そのトークンを `alchemy.run.ts` の `CF_BEACON_TOKEN` に設定する。
- SSR アプリの場合、`start.ts` で Worker の `CF_BEACON_TOKEN` から HTML にビーコンを追加する。静的ページの場合は、ビルド時に `VITE_CF_BEACON_TOKEN` からルートの `head` に挿入される。ゾーンの自動インジェクションは Workers のレスポンスには適用されない。
