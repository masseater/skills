# Trusted Publisher を登録する

1. パッケージはレジストリに存在していること。なければ [`claim-new-name`](claim-new-name.md) を先に行う。ログインしていなければ [`log-in`](log-in.md) を行う。
2. すべてのパッケージを 1 回のコマンドに渡す。`node scripts/npm-web.ts trust <owner/repo> <workflow-file> <environment> <package-name>...` を `run_in_background` で動かす。1 つのプロセスで続けると、1 回の承認で全パッケージが通る。コマンドは各パッケージの既存の設定を消してから、新しい設定を足す。
3. 出力の `APPROVAL` の行を、すぐ持ち主に渡す。パッケージごとに `UNTRUSTED` と `TRUSTED` が出る。
4. 登録の結果は、`publish.yml` を実行して確かめる。
