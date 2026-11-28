---
name: simplify-repo
description: リポジトリ全体を簡素化する。リポジトリを「シンプル化」するよう求められた際に使用する。
---

# simplify-repo

対象はメインブランチ全体である。差分だけ、あるいは自分が担当した部分だけを見るのは避けること。履歴や変更履歴、作業を行った担当者の意図を見ることは構わないが、全体を見る代わりにはならない。

## 確認すべき箇所

以下の場所は必ず最初に確認しなければならない。

- `vite.config.ts` や `fallow.json` などのルート設定ファイル
- `.github/`
- `.claude/`
- `.agents/`
- `docs/`
- `AGENTS.md`
- `README.md`
- `pnpm-workspace.yaml`

ユーザーが不要だと言わない限り、FSD の視点からもすべてのワークスペースを確認すること。

## ユースケース

- [`simplify`](usecases/simplify.md)。検出器の確認、全体のレビュー、指摘の処理、再レビューの順に簡素化を進める。
