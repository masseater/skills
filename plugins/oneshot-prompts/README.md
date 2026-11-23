# oneshot-prompts

ワンショットプロンプトの置き場である。

## プロンプト

`prompts/` の下を、方針をどこまで示すかで 4 段階に分けてある。

- `l1-hands-off`: 丸投げ。方針を示さない
- `l2-rough-idea`: 欲しいもののイメージを示す
- `l3-clear-brief`: 分野、こだわり、完成度を示す
- `l4-detailed-spec`: UI まで細かく示す

## スキル

- `search`: プロンプトを検索し、見つけたものをそのままコピーできる形で見せる。実行はしない
- `execute`: ユーザーだけが呼べる。選んだモデル（haiku、sonnet、opus、fable、mythos）で `claude -p` にプロンプトを流す

## 実行結果

`results/` の下に、`execute` で実行した結果を置く。パスは `prompts/` の下のプロンプトの ID と同じで、その下に実行条件とモデルごとの JSON がある。

```text
results/<ID>/
  meta.json      実行条件と、モデルごとの実際のモデル ID、開始時刻、所要秒数
  <モデル>.json   モデルが作ったファイルの、パスと中身をそのまま入れたもの
```

- 実行は隔離した `claude -p` で行い、effort は medium、権限モードは `bypassPermissions` にした
- haiku、sonnet、opus、fable、mythos の 5 モデルで実行した。mythos は `claude-mythos-5-2` で実行した
- `<モデル>.json` の `files` は、パスをキー、ファイルの中身を値にする。中身は直さない。実行や確認で手を入れた物は入れない
- 中身を JSON の文字列にするのは、リポジトリのチェック（コメント禁止、レガシー Web の検出など）がモデルの出力に反応するため。チェックは無視リストで黙らせない決まりなので、検査の対象外になる形で置く。zip は claude.ai への同期の制限で置けない
- 隔離せずに実行した結果は、実行環境の物が混ざるので置かない

## インストール

`/plugin install oneshot-prompts@masseater` でインストールする。`/oneshot-prompts:search ECサイト` のように検索し、`/oneshot-prompts:execute <id>` で実行する。
