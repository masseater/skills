---
name: vite-plus
description: Vite+ の `vp` でインストール、実行、検査、テストをする。`vite-plus` を使うリポジトリでコマンドを実行するとき、タスクや検査を足すとき、生成されたコマンドを読み替えるときに使う。
metadata:
  derived-from: https://github.com/voidzero-dev/vite-plus/blob/671b5e46e228a45346dd82ff1b1517c3730435a7/packages/cli/AGENTS.md
---

# vite-plus

- コマンドは `vp` から実行する。`pnpm`・`pnpx`・`npx` は直接使わない
- 生成されたブロックや他のツールの文書にある `pnpm exec`・`pnpm dlx` は `vp exec`・`vp dlx` に読み替える
- 作業の完了は `vp run verify` が通ることである

## この skill が必要な理由と達成したい状態

この skill が必要な理由は、Vite+ が Vite、Rolldown、Vitest、tsdown、Oxlint、Oxfmt、Vite Task とパッケージマネージャーを 1 つの `vp` に包んでいて、中のツールを直接呼んでも一見動くことにある。直接呼ぶと、`vp` が固定した版と設定、リポジトリのタスク、フックを通らないので、手元で通った結果が CI やフックの結果と食い違う。

この skill で達成したい状態は、手元、フック、CI のどこで動かしても、同じ `vp` の入口から同じ結果が出ることである。

## 組み込みコマンドとタスク

`vp <name>` は組み込みコマンドで、`vp run <name>` は `package.json` の script か `vite.config.ts` のタスクである。script は組み込みを上書きできないので、`vp dev` と `vp run dev` は別のことをしうる。リポジトリに同じ名前のタスクがあれば `vp run <name>` を使う。

| すること | コマンド |
| --- | --- |
| pull の後と作業の前に依存を入れる | `vp install` |
| 依存を足す・上げる | `vp add`・`vp update` |
| 依存の入ったコマンドを動かす | `vp exec <bin>` |
| 依存に無いコマンドを一度だけ動かす | `vp dlx <pkg>` |
| fmt・lint・型検査 | `vp check` |
| テスト | `vp test`。1 ファイルだけなら、そのパッケージで `vp test run <ファイル>` |
| 全部の検査 | `vp run verify` |
| TypeScript のスクリプトを動かす | `vpx <file>`。`tsx` や `ts-node` は足さない |
| 版と依存の関係を見る | `vp toolchain [<ツール名>]`・`vp why <pkg>` |
| セットアップがおかしいとき | `vp env doctor`。助けを求めるときは出力を添える |

正確な引数は `vp help` と `vp <command> --help`、`node_modules/vite-plus/docs` に任せる。

## 検査とフック

- 検査を足すときは、`vite.config.ts` のタスクにして `verify` の `dependsOn` に入れる。フックと CI が同じ `verify` を動かすので、そこに入れた検査だけがすべての経路で効く
- pre-push フックを `--no-verify` で飛ばさない
- Vite+ の使い方はこの skill に置き、AGENTS.md に書かない。`vp create`・`vp migrate` に `--agent` を付けない。付けると AGENTS.md に Vite+ の節が足され、以後の `vp config` が目印の `<!--VITE PLUS START-->` の間を書き直し続ける
