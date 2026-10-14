---
name: skill-authoring
description: Agent Skills の skill（`SKILL.md` とそのディレクトリ）を作る・直す・添削するときに読む。frontmatter と metadata の書き方、大本の skill の参照、本文を削る基準、検証の手順を決める。
metadata:
  upstream: https://github.com/cursor/plugins/blob/bebaffe14f8f442b98e9c409e960aedad59b5fc8/pstack/skills/poteto-mode/playbooks/authoring-a-skill.md
---

# skill の作成・変更

**skill の書きぶりはあなたが責任を持つ。**

skill は https://agentskills.io/specification が定義するものである。frontmatter、ディレクトリ構成、ファイル参照はこの仕様に従う。

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

迷ったら消す。判断を変える文だけを残す。何をするかを命じ、理由は書かない。理由がないと混乱する規則にだけ説明を付ける。文の調子は扱う範囲に合わせる。構造的な情報源（型、README、設定）を指し示し、繰り返す指示は文を足さずに lint・メタデータ・実行時の検査・スクリプトにする。他の skill にはパスで委ね、言い直さない。繰り返し踏むのに skill になっていない手順があれば、新しい skill を提案する。

**返答:** skill の要約、主な設計判断、検証の結果。
