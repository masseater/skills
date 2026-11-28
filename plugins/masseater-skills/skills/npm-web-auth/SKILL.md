---
name: npm-web-auth
description: クラウドのセッションから npm の書き込み（新しい名前の確保、Trusted Publisher の登録、deprecate）を、持ち主の 2FA 承認リンクで通す。npm に新しい名前を出すとき、Trusted Publisher を登録し直すとき、古い版を deprecate するとき、npm の承認リンクが切れたり届かなかったりするときに使う。
---

# npm-web-auth

## このスキルが存在する理由と目指すべき状態

このスキルが必要な理由は、npm の書き込みには持ち主の 2FA 承認が要り、その承認の仕組みが npm CLI からは見えないからである。承認リンクは 5 分で切れる。承認の結果を返す `doneUrl` は、リンクを要求した接続の出口 IP にしか答えない。承認で得たワンタイムトークンは 1 回しか使えない。このコンテナは接続ごとに出口 IP が変わり、npm CLI は端末が無いとリンクを伏せる。そのため AI が CLI を呼ぶと、承認が届いても検知できず、持ち主は承認したのに「承認されなかった」と言われ、リンクの頼み直しが続く。承認画面を見ずに「5 分間は確認しない」箱を押すよう頼む誤りも生まれる。承認画面に出るのはセキュリティキーの承認だけで、その箱は無い。

このスキルが目指す状態は、持ち主が名前の確保、Trusted Publisher の登録、deprecate のどれかを頼むと、AI が必要な承認の数を先に伝え、持ち主がいる間にリンクを 1 つずつ出し、持ち主の操作が各リンクを開いて承認することだけで済むことである。

## ルール

- 公開（publish）には使わない。公開は `publish.yml` の Trusted Publishing（OIDC）が行い、承認が要らない。このスキルを使うのは、名前の確保、Trusted Publisher の登録、deprecate だけである。承認の要る手順に公開を混ぜると、持ち主の手が増えるからである。
- 書き込みはすべて [`scripts/npm-web.ts`](scripts/npm-web.ts) の 1 つの Node プロセスで行う。承認の結果が、リンクを要求した接続にしか返らないからである。`npm` CLI、別プロセス、`curl` は使わない。
- ログインは 1 回の承認で済み、得られるセッショントークンは約 2 時間有効である。[`log-in`](usecases/log-in.md) に従う。
- 始める前に、承認の数を数えて持ち主に伝える。数は書き込みの種類で決まる。名前の確保は名前ごとに 1 件、Trusted Publisher の登録は 1 つのプロセスで続ければ全パッケージで 1 件、deprecate はパッケージごとに 1 件である。持ち主の手間を決めるのは数だからである。
- deprecate は持ち主が頼んだときだけ行う。古い版を非推奨にするだけで、誰の作業も進まないのに、パッケージごとに承認が要るからである。
- リンクは 5 分で切れるので、持ち主が席にいると言ったときだけ出す。リンクはスクリプトの出力に `APPROVAL <url>` の行で出るので、見つけたらすぐに `post_message` で渡す。出してから渡すまでの遅れで切れるからである。
- 持ち主に「5 分間は確認しない」箱を押すよう頼まない。承認画面にその箱は出ない。
- 承認が届かないとき、持ち主が承認していないと決めつけない。まず自分の受け取りを疑い、出力の `POLLFAIL` や 403 を見て、1 つのプロセスで動いているかを確かめる。持ち主は承認していることが多いからである。
- bypass 2FA の granular token で Trusted Publisher の登録をしようとしない。2026-07-31 から、そのトークンは信頼設定、アクセス設定、トークンの作成ができない（[GitHub の変更履歴](https://github.blog/changelog/2026-07-31-restricting-npm-bypass-2fa-granular-access-tokens)）。
- 信頼リンクを繰り返し出しても通らないときは、持ち主に npmjs.com のパッケージの Settings にある Trusted Publisher のフォーム（GitHub Actions、リポジトリ、`publish.yml`、環境 `npm`）の入力を頼む。2026-11-19 に、リンクが通らなかった 12 回のあと、このフォームで通った。

## ユースケース

- セッショントークンを得る：[`log-in`](usecases/log-in.md)
- 新しい名前を確保する：[`claim-new-name`](usecases/claim-new-name.md)
- Trusted Publisher を登録する：[`register-trusted-publisher`](usecases/register-trusted-publisher.md)
- 古い版を deprecate する：[`deprecate-versions`](usecases/deprecate-versions.md)

## 参照

- npm レジストリの挙動で、ドキュメントに書かれていない事実：[`registry-facts`](references/registry-facts.md)
