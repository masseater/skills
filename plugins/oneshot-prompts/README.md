# oneshot-prompts

ワンショットプロンプトの置き場である。`prompts/` の下を、方針をどこまで示すかで `l1-hands-off`（丸投げ）、`l2-rough-idea`（イメージを示す）、`l3-clear-brief`（分野、こだわり、完成度を示す）、`l4-detailed-spec`（UI まで細かく示す）の 4 段階に分けてある。`search` スキルは検索だけで、見つけたプロンプトをそのままコピーできる形でユーザーに見せる。`execute` スキルはユーザーだけが呼べ、選んだモデル（haiku、sonnet、opus、fable）で `claude -p` にプロンプトを流す。

`/plugin install oneshot-prompts@masseater` でインストールする。`/oneshot-prompts:search ECサイト` のように検索し、`/oneshot-prompts:execute <id>` で実行する。
