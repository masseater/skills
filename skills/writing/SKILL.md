---
name: writing
description: 日本語の文章を書く・推敲するときに読む。ドキュメント、コメント、コミットメッセージ、PR 本文、記事、解説のような説明文の規範に、読み物の緩急の設計、小説、Zenn 記事の書き方を加えたもの。「AI っぽい」「読みにくい」文章を直すときにも使う。
metadata:
  upstream: >-
    https://github.com/masseater/claude-code-plugin/tree/2e0619b1ab620552764da5ea6e46b77a0dcfaa35/plugins/writing
    https://github.com/philtzjp/skills/blob/5d8b844e8cf087515a345b56bf5b40ad8125f4bc/.agents/skills/japanese/SKILL.md
---

# writing

## この skill が必要な理由と達成したい状態

この skill が必要な理由は、AI の書く日本語に、理由の欠落、陳腐化する情報の多さ、反射的な読点による不自然な拍といった癖があることにある。この癖は読者を疲れさせ、大事な判断基準を埋もれさせる。

この skill で達成したい状態は、読者が疲れずに読み通せ、判断基準が埋もれずに伝わる文章になっていることである。

## 大原則

この skill の規範は、文型や禁止事項として機械的に当てはめるものではない。重要なのは「どう直すか」ではなく、「その修正によって文章の何を守るのか」である。形式ではなく、文章が果たしている働きから判断する。

規範の本文は著者の文体そのものなので、一般論に置き換えたり語調を揃えたりする編集で中身を薄めない。

## 規範

`references/` は説明文の規範である。日本語の説明文を書くたびに読む。

- [`purpose-and-reason`](references/purpose-and-reason.md): そうする目的を書く。動作の説明は理由の代わりにならず、技術で完結する理由はプロダクトの要件まで遡る。
- [`no-perishable-information`](references/no-perishable-information.md): コードや設定から導出できる個数、名称、配置を文書に複製せず、正本を参照する。
- [`punctuation`](references/punctuation.md): 句読点は音読の間ではなく、読者が意味を認識する単位の境界に打つ。
- [`purpose-before-means`](references/purpose-before-means.md): 手段と目的があるときは目的を先に書き、目的を括弧に入れない。
- [`headings`](references/headings.md): 見出しは体言止めにし、敬語や「〜します」で書かない。
- [`rhythm`](references/rhythm.md): 読み物として読ませたい章、記事、解説を書くときと、「密度はあるが平坦でおもしろくない」文章を診断するときだけ読む。

## 用途

`usecases/` は特定の文章を書くときの手順である。当てはまるときだけ読む。

- [`novel`](usecases/novel.md): 小説や物語を書く、増補する、改稿するとき。説明文の規範はそのまま当てはめない。
- [`zenn-article`](usecases/zenn-article.md): 会話の内容や指定されたトピックから Zenn の技術記事を書き、masseater/zenn-article に PR を出す。ユーザーに頼まれたときだけ読み、PR は承認を得てから出す。
