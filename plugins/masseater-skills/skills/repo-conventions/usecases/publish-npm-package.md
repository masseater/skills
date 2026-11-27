# npmへのパッケージ公開

1. パッケージから `private` を削除し、`publishConfig` を付与する。`publish.yml` はこれら2つで公開対象を選択する。
2. `publish.yml` は Trusted Publisher (GitHub OIDC) と `--provenance` を指定して公開する。npm 側では `publish.yml` と環境 `npm` を登録する。トークンは保持しない。
3. release-please を使用する場合、`verify.yml` の `release` ジョブの `if` をリポジトリ名に設定し、パッケージの `package.json` のバージョンも `extra-files` で引き上げる。リリースがカットされると、`publish.yml` が呼び出される。
4. `vp pack` の設定に `publint: { strict: true }` と `attw: { profile: "esm-only", level: "error" }` を記述し、devDependencies に `publint` と `@arethetypeswrong/core` を追加する。fallow はこれら2つの使用状況を追跡できないため、`.fallowrc.jsonc` の `ignoreDependencies` に列挙する。
5. size-limit (`@size-limit/file`) でバンドルサイズを測定する。パッケージの `run.tasks` に `size: { command: "size-limit", dependsOn: ["build"] }` を、`package.json` に `size-limit` の設定を記述し、ルートの `vite.config.ts` に `"size-all": "vp run -r size"` を追加して、verify の `dependsOn` に記述する。ターゲットタスクが一つも存在しない場合、`vp run -r` は失敗する。
6. `limit` は現在のサイズ（バイト単位）通りに記述する。サイズを増加させる際は `limit` を引き上げ、その理由をコミットメッセージに記述する。
7. `package.json`の`description`フィールドに、パッケージの機能と使用タイミングを記載するように記述する。他のリポジトリのAIは `vp pm search maintainer:r_masseater` でmasseaterが公開しているパッケージの一覧を読み取り、その一覧にはこの説明文だけが表示される。
8. 各ツールチェーンのサポート範囲を宣言し、CIでその両端をテストする。詳細は [`published-packages`](../references/published-packages.md) に従うこと。
