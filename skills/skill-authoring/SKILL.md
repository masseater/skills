---
name: skill-authoring
description: Agent Skills の skill（`SKILL.md` とそのディレクトリ）を作る・直す・添削するときに読む。frontmatter と metadata の書き方、大本の skill の参照、本文を削る基準、検証の手順を決める。
metadata:
  upstream: https://github.com/cursor/plugins/blob/bebaffe14f8f442b98e9c409e960aedad59b5fc8/pstack/skills/poteto-mode/playbooks/authoring-a-skill.md
---

# skill の作成・変更

## 目的

書いた本人がいない場面では、モデルは skill に書かれたことからしか判断できない。判断を変えない文は、判断を変える文を薄める。

## 達成したい状態

skill を読んだモデルが、書いていない場面でも書き手と同じ判断を下せる。

## 前提

skill の書きぶりはあなたが責任を持つ。

skill は https://agentskills.io/specification が定義するものである。frontmatter、ディレクトリ構成、ファイル参照はこの仕様に従う。

skill は Claude Opus 5.5 が読む。本文は https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-opus-5-5 と、そこから参照される https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices を読み、その通りに書く。下の「本文」はその要点である。

## 構成

本文は「目的」「達成したい状態」の 2 つのセクションで始め、手順や規則のセクションと分ける。

- 目的: この skill がないと何が起きるか。なぜ必要か。
- 達成したい状態: skill に従った結果、どうなっていればよいか。

規則が当てはまらない場面では、モデルはこの 2 つから判断する。規則はすべてこの 2 つから導けるように書き、ずれた規則は直すか消す。2 つが言えない skill は、まだ作る段階にない。

## frontmatter

- `name`: ディレクトリ名と同じにする。
- `description`: 何をするかと、いつ使うかを書く。使う場面の語を入れる。
- `license`: 書かない。LICENSE ファイルも作らない。
- `metadata.upstream`: 大本の skill と、参考にした資料の URL。`references/` のファイルの大本もここに入れる。GitHub の URL はコミットを指定した permalink にする。

大本の URL、作者、バージョンは本文と `references/` に書かず、`metadata` に入れる。

`metadata` の値は文字列だけである。複数の URL は空白区切りの 1 つの文字列にする。

```yaml
metadata:
  upstream: >-
    https://github.com/<owner>/<repo>/blob/<commit>/path/SKILL.md
    https://example.com/article
```

## 手順

1. skills CLI の `skills init <name>` で `SKILL.md` を作る。複数のリポジトリで使う skill は masseater/skills の `skills/` に置く。ここに置いた skill は Claude Code プラグイン `masseater-skills` にも入る。
2. 検証する。`skills-ref validate <dir>` を通し、上の frontmatter の規則を満たすこと、参照するファイルが存在すること、他の skill へのリンクが解決することを確かめる。
3. 構造的な内容ならテストケースを書く。主観的な内容なら書かない。
4. リポジトリの手順で PR を出す。

## 本文

- 記述を消すことを恐れない。判断を変えない文、ほかの場所の言い直し、言われなくてもモデルがやることは消す。迷ったら消す。
- 規則には理由を一文添える。モデルは理由から、書いていない場面にも規則を広げて当てはめる。理由がなくても読み違えようのない規則には付けない。
- 「〜しない」で終えず、代わりに何をするかを書く。避けてほしい形は「汎用的な見た目を避ける」のような一般論にせず、具体的に名指しする。
- 出力の形を決めたいときは、文で説明するより良い例を示す。
- 「よく考えてから」「最終確認をする」「見直してから答える」のような思考や検証の指示は書かない。モデルは自分でやり、指示すると過剰になる。推論を書き出させる指示は拒否されうるので、要るなら結果の短い説明を求める。
- 徹底させるための強い言い回しや強調を足さない。いまのモデルは指示に過敏に反応する。
- 文の調子は扱う範囲に合わせる。
- 構造的な情報源（型、README、設定）を指し示し、繰り返す指示は文を足さずに lint・メタデータ・実行時の検査・スクリプトにする。
- 他の skill にはパスで委ね、言い直さない。
- 繰り返し踏むのに skill になっていない手順があれば、新しい skill を提案する。

返答: skill の要約、主な設計判断、検証の結果。
