# 古い版を deprecate する

1. 持ち主が頼んだことを確かめる。パッケージごとに承認が 1 件要るので、件数を先に伝える。ログインしていなければ [`log-in`](log-in.md) を行う。
2. `node scripts/npm-web.ts deprecate "<message>" <package-name>...` を `run_in_background` で動かす。`<package-name>@1.0.0,1.1.0` と書くと、その版だけが対象になる。版を書かなければ全版が対象になる。
3. パッケージごとに `APPROVAL` の行が出る。出るたびにすぐ持ち主に渡す。承認されると `DEPRECATED` が出て、次のパッケージに進む。
