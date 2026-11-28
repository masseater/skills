# クラウドから LUNA につなぐ

1. クラウドのセッションで、ポータルのツール `sundries_join_tailnet` を `~/.ssh/win.pub` の 1 行を渡して呼ぶ。返ってきた値で `tailscale up --client-id=<clientId> --id-token=<idToken> --advertise-tags=tag:agent --accept-dns=false` を実行し、`sshCertificate` を `~/.ssh/win-cert.pub` に書く。ID トークンの有効期間は 5 分、証明書は 1 時間である。`ssh win` が `Connection closed` と答えたとき、または `tailscale status` が `Logged out` と表示したときは、この手順をやり直す。
2. `ssh win` が応答すること、LUNA が起動していること（`Get-Process LUNA`）、エンジンが `127.0.0.1:4718` で待ち受けていることを確かめる。LUNA を自分で起動したり前面に出したりしない。持ち主の作業中のウィンドウを奪うからである。LUNA が動いていなければ、持ち主に起動を頼む。
3. SDK は ユーザーフォルダの `sandbox`（`%USERPROFILE%\sandbox`）に一度だけ入れる。`git clone --depth 1 -c core.autocrlf=false https://github.com/uaudio-labs/luna-builder-sdk` のあとに `npm ci` を実行する。Windows の既定の改行コードのままだと、`SKILL.md` でビルドが失敗する。エンジンが待ち受けているかは `node dist\cli.js doctor` で分かる。
4. スクリプトはクラウド側で書き、`scp` で送り、`ssh win 'node C:\path\script.mjs'` で実行する。PowerShell は JSON の引用符を壊すので、引数はファイルで渡す。SDK は `dist/index.js` の絶対パスを `pathToFileURL` で `file:` の URL にして import する。Windows の Node はドライブ文字から始まるパスを import できない。
5. セッションは `const luna = await Luna.connect(); const session = await luna.session(); await session.ready?.()` で開く。返ってくるのは持ち主が開いているセッションである。区切りがつくたびに `session.save({ label })` で保存する。
