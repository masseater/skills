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

## インストール

`/plugin install oneshot-prompts@masseater` でインストールする。`/oneshot-prompts:search ECサイト` のように検索し、`/oneshot-prompts:execute <id>` で実行する。
