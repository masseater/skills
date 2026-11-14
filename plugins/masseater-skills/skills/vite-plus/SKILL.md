---
name: vite-plus
description: Vite+ の `vp` でインストール、実行、確認、テストを行う。`vite-plus` を使用するリポジトリでコマンドを実行する際、タスクやチェックを追加する際、および生成されたコマンドを翻訳する際に使用する。
---

# vite-plus

- 使用方法については、インストール済みバージョンの公式 `node_modules/vite-plus/AGENTS.md` を読み、それに従うこと。詳細な引数は `vp help`、`vp <command> --help`、および `node_modules/vite-plus/docs` に任せる。
- コマンドは `vp` 経由で実行する。`pnpm`、`pnpx`、`npx` を直接使用せず、生成されたブロックや他のツールのドキュメント内の `pnpm exec` および `pnpm dlx` は `vp exec` および `vp dlx` に置き換えること。
- `vp run verify` がパスすれば作業完了となる。

## このスキルが必要な理由と、実現すべき状態

このスキルが必要な理由は、Vite+ の公式ガイダンスが `vp create` や `vp migrate` によって AGENTS.md にコピーされて初めて各リポジトリに届くためである。公式の Vite+ スキルは存在せず（[#2781](https://github.com/voidzero-dev/vite-plus/issues/2781) は提案段階のままであり、[#560](https://github.com/voidzero-dev/vite-plus/issues/560) は npm パッケージの AGENTS.md で十分であるという理由でクローズされた）、バージョンが上がるたびにコピーが古くなっていく。

このスキルが実現すべき状態とは、公式ガイダンスがパッケージ内のオリジナルから読み込まれ、Masseator のリポジトリ向けに追加されたルールのみがここに保持されている状態である。ローカルで実行しても、フックで実行しても CI で実行しても、同じ `vp` エントリーポイントで同様の結果が得られる。

## タスクとスクリプト

- `prepare` や `prepack` などのライフサイクルスクリプトのみを package.json のスクリプトに記述すること。その他のコマンドは、そのパッケージの `vite.config.ts` 内の `run.tasks` に記述すること。スクリプト文字列は型チェックができず、引数が1行で構成されるコマンドが壊れたとしても気づかない。
- 組み込みスクリプトと単に同じ処理を行うタスク（`build: "vp build"` など）は作成せず、`vp build` と `vp pack` を直接使用すること。
- モノレポ対応ツールは、ルートで一度だけ実行すること。テストの場合は、ルートの `test.projects` に pnpm-workspace と同じ glob をリストして `vp test run` を実行すること。fallow はルートで一度の実行でワークスペース全体を対象とする。同じチェックタスクを各パッケージにコピーしないこと。`test.projects` の glob に一致し、かつパッケージではないディレクトリは `!` で除外し、`.gitkeep` などのファイルをワークスペースの直下に置かないこと。Vitest は両方をプロジェクトとして読み込もうとして失敗する。
- 特定のパッケージのタスクに依存する場合、`vp run --filter` をラップするタスクを作成せず、`dependsOn` に `<package name>#<task name>` と記述すること。`vp run -r` は、同名のタスクを持つすべてのパッケージでタスクを実行する場合にのみ使用すること。
- ファイルを書き込むタスク（build, deploy, generation, measurement）には `cache: false` を設定すること。
- タスクから呼び出されたファイルは fallow の解析では見えないため、`.fallowrc.jsonc` の `entry` に追加すること。fallow はルートの `vite.config.ts` に記述されたタスク文字列からバイナリの使用状況を拾うため、`run` を別ファイルに分割しないこと。

## チェックとフック

- チェックを追加する際は、`vite.config.ts` のタスクとして記述し、`verify` の `dependsOn` に配置すること。フックと CI は同じ `verify` を実行するため、そこに配置されたチェックのみがすべてのパスで有効になる。
- `--no-verify` でプリプッシュフックをスキップしないこと。
- 公式ガイダンスを AGENTS.md にコピーしないこと。`vp create` や `vp migrate` に `--agent` を渡さないこと。これを行うと AGENTS.md に Vite+ セクションが追加され、それ以降のすべての `vp config` で `<!--VITE PLUS START-->` マーカーの間の内容が書き換えられ続ける。
