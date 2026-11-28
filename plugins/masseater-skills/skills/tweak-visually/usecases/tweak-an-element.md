# 要素を動かして見た目を決める

1. 対象が Vite の React アプリか確かめる。違えば、このスキルは使わない。
2. 作業用のブランチを作り、made-refine と `vite-plugin-singlefile` を、そのリポジトリの流儀で `devDependencies` に足す。
3. 作業用のブランチで、`App` に `<DirectEdit />` を常に描画させ、`vite.config.ts` に `viteSingleFile()` と `build: { minify: false }` を足す。`init` は使わない。理由は [`made-refine`](../references/made-refine.md) にある。
4. ビルドし、[`wrap-artifact.ts`](../scripts/wrap-artifact.ts) でアーティファクト用の HTML にして公開する。`node scripts/wrap-artifact.ts dist/index.html artifact.html "<名前>"` を実行し、できた `artifact.html` を Artifact ツールで公開する。名前はアプリの名前にする。
5. 白紙でないことを、ローカルで `vite preview` を開いて自分で確かめてから、URL を持ち主に伝える。
6. 持ち主に、`Ctrl + .`（Mac は `Cmd + .`）で編集画面を開き、要素をクリックして動かし、右下のコピーボタンで差分をコピーしてチャットに貼るよう伝える。
7. 貼られた差分を受け取る。`selector` と `context` で要素を見つけ、`edits` の値を、そのリポジトリのスタイルの書き方に直して、ソースのブランチに反映する。
8. 作業用のブランチをソースのブランチに合わせ、3 から 4 をやり直し、同じファイルを同じ URL に公開し直す。
9. 持ち主が「これで確定」と言うまで、6 から 8 を繰り返す。
10. 確定したら、作業用のブランチを捨て、ソースのブランチの `git diff` に、反映した見た目の変更だけが残っていることを確かめる。
