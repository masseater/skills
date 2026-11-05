---
name: vite-plus
description: Vite+ の `vp` でインストール、実行、検査、テストをする。`vite-plus` を使うリポジトリでコマンドを実行するとき、タスクや検査を足すとき、生成されたコマンドを読み替えるときに使う。
---

# vite-plus

- 使い方は、入っている版の公式の `node_modules/vite-plus/AGENTS.md` を読み、従う。細かい引数は `vp help`・`vp <command> --help`・`node_modules/vite-plus/docs` に任せる
- コマンドは `vp` から実行する。`pnpm`・`pnpx`・`npx` は直接使わず、生成されたブロックや他のツールの文書にある `pnpm exec`・`pnpm dlx` は `vp exec`・`vp dlx` に読み替える
- 作業の完了は `vp run verify` が通ることである

## この skill が必要な理由と達成したい状態

この skill が必要な理由は、Vite+ の公式の案内が `vp create`・`vp migrate` で各リポの AGENTS.md に書き写す形でしか届かないことにある。Vite+ 公式の skill は無く（[#2781](https://github.com/voidzero-dev/vite-plus/issues/2781) は提案のまま、[#560](https://github.com/voidzero-dev/vite-plus/issues/560) は npm パッケージの AGENTS.md で足りるとして閉じた）、書き写した写しは版が上がるたびに古くなる。

この skill で達成したい状態は、公式の案内をパッケージに入っている原本から読み、masseater のリポジトリで足した決まりだけをここに置くことである。手元、フック、CI のどこで動かしても、同じ `vp` の入口から同じ結果が出る。

## 検査とフック

- 検査を足すときは、`vite.config.ts` のタスクにして `verify` の `dependsOn` に入れる。フックと CI が同じ `verify` を動かすので、そこに入れた検査だけがすべての経路で効く
- pre-push フックを `--no-verify` で飛ばさない
- 公式の案内を AGENTS.md に写さない。`vp create`・`vp migrate` に `--agent` を付けない。付けると AGENTS.md に Vite+ の節が足され、以後の `vp config` が目印の `<!--VITE PLUS START-->` の間を書き直し続ける
