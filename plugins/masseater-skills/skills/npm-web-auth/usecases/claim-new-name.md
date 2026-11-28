# 新しい名前を確保する

新しい名前は、パッケージが存在するまで Trusted Publisher を登録できず、OIDC で最初の版も出せない。そこで 0.0.0 の仮の版を手元から出して名前を押さえ、そのあと [`register-trusted-publisher`](register-trusted-publisher.md) で登録する。

1. 名前の数を数え、承認が名前ごとに 1 件であると持ち主に伝える。ログインしていなければ [`log-in`](log-in.md) を行う。
2. `node scripts/npm-web.ts claim <package-dir>...` を `run_in_background` で動かす。引数は `package.json` を持つディレクトリで、仮の版には `name`、`license`、`repository`、`homepage`、`bugs` だけが入る。
3. 出力に 1 件ずつ `APPROVAL` の行が出る。承認されると `PUBLISHED`、レジストリに見えるようになると `VISIBLE` が出て、次の名前に進む。見えるまで 1 分ほどかかる。
4. 全部 `VISIBLE` になってから、Trusted Publisher を登録する。
