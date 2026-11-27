# Cloudflare にデプロイするリポジトリ

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

## すべてを日本で動かす

Cloudflareのすべてのリソースは日本で動作する。Cloudflare には、すべての製品で日本を指定できる設定がないため、各リソースは提供されている最も近いヒントを使う。

- Workers: Worker に `placement: { region: "aws:ap-northeast-1" }` を設定する。
- Durable Objects: `get()` に `locationHint: "apac-ne"` を渡す。別の場所で作られたオブジェクトは、新しい名前のオブジェクトに作り直す。
- D1: データベース作成時に `primaryLocationHint: "apac"` を設定する。
- R2: バケット作成時に `locationHint: "apac"` を設定する。Cloudflare は、その名前のバケットが最初に作成された場合にのみこれを反映する。

ヒントは努力目標であり、D1 と R2 には `apac` より狭いヒントがない。すでにあるリソースは動かない。動かすには、ヒントを用いて新しいリソースを作成し、データをコピーし、移し元の主キーまたはオブジェクトのキーの集合が移し先に全部含まれることを確かめて切り替えを行い、その後で古いリソースを削除する。件数の一致では確かめにならない。移し先にはコピー中も書き込みが続くので、件数が合っても移し元の行が欠けていることがある。動かすためにデータを捨ててはならない。手順は [`move-workers-to-japan`](../usecases/move-workers-to-japan.md) に記載されている。
