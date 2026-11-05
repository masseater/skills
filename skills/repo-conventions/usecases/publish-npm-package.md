# npm にパッケージを出す

1. パッケージの `private` を外して `publishConfig` を持たせる。`publish.yml` はこの 2 つで出す対象を選ぶ
2. `publish.yml` は Trusted Publisher（GitHub OIDC）で `--provenance` を付けて出す。npm 側には `publish.yml` と environment `npm` を登録する。トークンは置かない
3. release-please を使うなら、`verify.yml` の `release` ジョブの `if` を自分のリポ名にし、`extra-files` でパッケージの `package.json` の version も上げる。リリースが切れると `publish.yml` が呼ばれる
4. `vp pack` の設定に `publint: { strict: true }` と `attw: { profile: "esm-only", level: "error" }` を書き、`publint` と `@arethetypeswrong/core` を devDependencies に入れる。fallow はこの 2 つの利用を辿れないので、`.fallowrc.jsonc` の `ignoreDependencies` に載せる
5. バンドルサイズを size-limit（`@size-limit/file`）で測る。パッケージに `"size": "vp run build && size-limit"` と `size-limit` の設定を置き、ルートの `vite.config.ts` に `"size-all": "vp run -r size"` を足して verify の `dependsOn` に入れる。`vp run -r` は対象のタスクが 1 つも無いと落ちる
6. `limit` は今の大きさをバイト単位でちょうどに書く。増やすときは `limit` を上げ、その理由をコミットメッセージに書く
