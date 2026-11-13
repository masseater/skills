# 認証の種類ごとの入口

## Cloudflare Access の背後のサイト

持ち主と同じ Google のログインを、Access の Managed OAuth で通る。

- Access のアプリで Managed OAuth を有効にし、masseater/masseater.dev の `infra/repositories/access-sites.ts` にホストを足す
- 持ち主が `https://credentials.masseater.dev/access-oauth/login?site=<ホスト>` で一度ログインすると、sundries の `get_access_token` が本人のアクセストークンを返す。`status` が `login` のときは、返った `loginUrl` を持ち主に渡す
- リクエストに `Authorization: Bearer <accessToken>` を付ける。Playwright では `context.route` で対象のホストへのリクエストにだけ付ける。全リクエストに付く `extraHTTPHeaders` は、ほかのホストにトークンを送ってしまう
- トークンは約 15 分で切れるので、切れたら `get_access_token` を呼び直す
- 自前の OAuth を持つアプリを Access の背後に置くときは、そのアプリで Managed OAuth を有効にしない。アプリ自身の `WWW-Authenticate` に頼る OAuth が壊れると [Cloudflare の文書](https://developers.cloudflare.com/cloudflare-one/access-controls/applications/http-apps/managed-oauth/)にある
- workers.dev やプレビューの URL が認証なしで中身を返さないことは、デプロイの後に確かめる。personal-space の `apps/mcp/scripts/exposure-probe.sh` がその例である

## アプリ自身のパスキーのログイン

masseater.dev の `libs/owner-auth` を使うアプリがこれにあたる。

- パスキーは持ち主の端末から写せない。本番の書き込みは、持ち主が一度同意した MCP の OAuth の接続を通して、AI も MCP のクライアントとして呼ぶ
- ログイン後の Web 画面を足すときは、画面より先に AI の入口を決める。案は、その画面を Access の背後にも置いて Managed OAuth で入ること、MCP と同じ OAuth のトークンを画面の API でも受けることである。どちらにするかは持ち主に示して決める
- テストでは、Playwright 1.61 以降の `browserContext.credentials` の仮想認証器でパスキーを登録し、本物のログインの処理を通す。`credentials.create()` で鍵を入れ、`credentials.install()` の後にページを開く
- 1.62 以降は `browserContext.storageState({ credentials: true })` で、パスキーもログイン状態と一緒に保存して次のテストに渡せる。保存したファイルは秘密鍵を含む

## ログイン状態の使い回し

- Playwright の setup project で一度ログインし、`storageState` をファイルに保存して、後のテストで読む。同じ context に入れ直すときは `browserContext.setStorageState()` を使う
- 対話的に調べるときは、同じファイルを Playwright MCP には `--isolated --storage-state <ファイル>` で、`playwright-cli` には `state-load <ファイル>` で渡す
- 保存したファイルは資格情報なのでコミットしない

## デスクトップアプリ

Tauri の管理アプリは、開発版だけ WebView のデバッグポートを開き、ブラウザの自動操作の道具でつないで操作する。手順は各リポジトリの AGENTS.md にある。

## AI から通せない入口

Cloudflare の MCP ポータルの管理者 OAuth のように、ダッシュボードでの本人のログインが要り、API から通せない入口がある。持ち主にはログインの URL を渡して一度だけ頼み、AI が確かめられないことを報告に書く。
