---
name: skill-authoring
description: skill（`SKILL.md`）を作る・直すときに読む。
metadata:
  upstream: https://github.com/cursor/plugins/blob/main/pstack/skills/poteto-mode/playbooks/authoring-a-skill.md
---

# skill の作成・変更

**skill の書きぶりはあなたが責任を持つ。**

skill は https://agentskills.io/specification が定義するものである。frontmatter、ディレクトリ構成、ファイル参照はこの仕様に従う。

参考にした skill があるときは、frontmatter に次を書く。

- `metadata.upstream`: 大本の skill の URL。`metadata` の値は文字列なので、複数あるときは空白区切りの 1 つの文字列にする。本文には書かない。
- `license`: 大本のライセンス。大本がライセンス文書の同梱を求めるなら、skill のディレクトリに置いてそのファイル名を書く。

1. skills CLI の `skills init <name>` で `SKILL.md` を作る。複数のリポジトリで使う skill は masseater/skills の `skills/` に置く。ここに置いた skill は Claude Code プラグイン `masseater-skills` にも入る。
2. 検証する。frontmatter が仕様に合うこと、参照するファイルが存在すること、他の skill へのリンクが解決することを確かめる。
3. 構造的な内容ならテストケースを書く。主観的な内容なら書かない。
4. リポジトリの手順で PR を出す。

迷ったら消す。判断を変える文だけを残す。何をするかを命じ、理由は書かない。理由がないと混乱する規則にだけ説明を付ける。文の調子は扱う範囲に合わせる。構造的な情報源（型、README、設定）を指し示し、繰り返す指示は文を足さずに lint・メタデータ・実行時の検査・スクリプトにする。他の skill にはパスで委ね、言い直さない。繰り返し踏むのに skill になっていない手順があれば、新しい skill を提案する。

**返答:** skill の要約、主な設計判断、検証の結果。
