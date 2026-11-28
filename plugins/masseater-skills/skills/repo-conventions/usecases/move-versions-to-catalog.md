# msch を上げたあとの移行を済ませる

msch は検査を増やした版で、利用側のリポジトリが新しい検査に落ちる。移行の道具はない。公開パッケージの移行機能は作らない方針で、コーディングエージェントが指摘ごとに手で直す。msch を上げる PR と同じ PR で直す。別の PR にすると、main の verify がその間落ちる。

## 手順

1. `vp exec msch` を実行し、指摘を一覧にする。
2. `uncataloged-dependency` の指摘ごとに、次の順で直す。
   - 依存の名前と版を、ルートの `pnpm-workspace.yaml` の `catalog:` の末尾に 1 行足す。足す前に、同じ名前がすでに `catalog:` にないか確かめる。ある場合、版が同じなら足さない。版が違うなら、どちらに揃えるかを決めてから、すべての package.json を揃える。黙って片方に寄せない。
   - package.json の版を `catalog:` に書き換える。
3. `prepublish-script` の指摘ごとに、公開パッケージの `scripts.prepublishOnly` を、指摘文の書かれたコマンドそのものにする。
4. `vp install`、`vp exec msch`、`vp run verify` の順に実行し、指摘が 0 になったことを確かめる。

## してはいけないこと

- `pnpm-workspace.yaml` を、yaml を組み直す道具で書き換えない。pnpm の書き込み関数（`@pnpm/workspace.workspace-manifest-writer`）は、`key: # exit: ...` の行末のコメントを次の行へ動かし、引用符の種類も変える。行末の `# exit:` は msch-exits が読むので、動くと別の検査に落ちる（2026-11-28 に masseater.dev で確かめた）。行を足すだけの編集にする。
- 指摘を黙らせるために、検査の設定を変えない。
