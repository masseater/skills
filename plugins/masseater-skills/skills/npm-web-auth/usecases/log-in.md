# セッショントークンを得る

1. 持ち主に、承認リンクを今出してよいか確かめる。
2. `node scripts/npm-web.ts login` を `run_in_background` で動かす。トークンは `NPM_WEB_DIR`（既定は `$TMPDIR/npm-web`）の `npmrc` に、モード 600 で書かれる。トークンは Git に入れない。
3. 出力に出る `APPROVAL https://www.npmjs.com/login?next=/login/cli/<id>` の行を、すぐ持ち主に渡す。
4. `LOGGED_IN` が出たら終わりである。約 2 時間で切れるので、切れたらもう一度行う。
