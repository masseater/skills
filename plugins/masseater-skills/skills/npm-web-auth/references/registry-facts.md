# npm レジストリの挙動

2026-11 に npm 11.20 で確かめた。公式の説明は [npm trust](https://docs.npmjs.com/cli/v11/commands/npm-trust) と [Trusted publishers](https://docs.npmjs.com/trusted-publishers) にある。

- 書き込みに `authType: "web"` を付けないと、401 の本文に `authUrl` と `doneUrl` が入らない。`npmCommand` を付けないと、「Upgrade your client」という EOTP になり、リンクが出ない。
- `doneUrl` は承認前は 202、承認後はワンタイムトークンと共に 200、リンクが切れたあとは 404 を返す。5xx は一時的なので、ポーリングを続ける。503 で止まるとリンクを無駄にする。
- 承認で得たトークンは 1 回の書き込みにしか使えない。成功したら直ちに捨てる。捨てないと次の書き込みが EOTP で失敗し、リンクも出ない。承認の直後は 429 が返ることがあるので、1.5 秒空ける。
- `POST /-/package/<name>/trust` の本文は `[{ "type": "github", "claims": { "repository": "<owner/repo>", "workflow_ref": { "file": "<file>" }, "environment": "<env>" }, "permissions": ["createPackage"] }]` である。`permissions` は必須である。
- 公開した直後は、`?write=true` を付けても 1 分ほど 404 が返る。新しい名前を押さえると、npm が staged publishing のプレースホルダー `0.0.0-stage` を先に出すことがある。
- ステージド・パブリッシングは、バージョンを一度に承認する web の画面を持つ（[Staged publishing](https://docs.npmjs.com/staged-publishing)）。OIDC から deprecate できるかは文書に書かれていない。
