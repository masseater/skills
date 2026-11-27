# cross-similar-code

複数のリポジトリにまたがる似た関数を、足りない抽象化として見つける。リポジトリごとのゲートは自分のリポジトリしか見ないので、分けたコードの同じ抽象化の欠けは、どのゲートにも映らない。

セッション開始フックが、固定バージョンの [fallow](https://github.com/fallow-rs/fallow) と `fallow-similar-code`、ローカルのモデル（`fallow similar-code setup --local --yes`）をユーザーのキャッシュ（`~/.cache/cross-similar-code`）に用意する。セッションはこの準備を待たない。モデルのダウンロードはオーナーが許可している。node と npm が要る。

`/plugin install cross-similar-code@masseater` でインストールする。

## スキル

- [cross-repo-similar-code](skills/cross-repo-similar-code/SKILL.md): 異なるリポジトリにある似た関数を fallow similar-code で見つけ、1 つにまとめる依頼にする

## 分かっていること

- fallow は 1 回の実行で 1 つのルートを解析する。リポジトリをシンボリックリンクで並べると 0 ファイルとして黙って飛ばされるので、実体のコピーを 1 つの親ディレクトリに置く。
- `similar-code` は 1 回の実行で最大 1,414 関数しか比べない（比較の上限が 100 万組）。上限に達した実行は `partial` になるので、`--file` で起点を絞り、ルートを分けて、すべての部分を `complete` にする。
- 埋め込みは冷えた状態で 1 関数あたり約 0.24 秒かかる。ベクトルはキャッシュされるので、2 回目以降は速い。
