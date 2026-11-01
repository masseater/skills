---
name: writing
description: 文章を書く・推敲するときに読む。ドキュメント、コメント、コミットメッセージ、PR 本文、README、masseater の名前で出す記事、小説が対象である。「AI っぽい」「冗長」「読みにくい」と言われた文章を直すとき、Claude との壁打ちを「記事化して」と言われたときにも使う。
metadata:
  derived-from: >-
    https://github.com/masseater/claude-code-plugin/tree/2e0619b1ab620552764da5ea6e46b77a0dcfaa35/plugins/writing
    https://github.com/cursor/plugins/blob/837067b75aa20ab58d7b2a2f6c0531e37118c596/pstack/skills/technical-writing/SKILL.md
    https://github.com/azukiazusa1/skills/tree/a7f996f1cd700a4a56827f6cf2a130ff5a9ceedf/skills/writing/write-blog-article
    https://github.com/artouc/stop-describe-ui/blob/251a859f6e40645030e1ae69fa4b501c851eac9c/skills/stop-describing-ui/SKILL.md
---

# writing

- 読者である人間の読み方と考え方は humanity-and-humanness に従う
- 日本語の言い回しは philtzjp/skills の [`japanese`](https://github.com/philtzjp/skills/blob/main/.agents/skills/japanese/SKILL.md) に従う
- この skill の規範は、その 2 つの上に足すものである

AI と人間では文章の読み方がまるで違う。AI は書いてあることをそのまま読み取り、書いていないところは自分の知識で埋める。人間はそうではなく推測で補いながら読むし、書いてあるとおりにも受け取らない。

覚えていられる量も違う。AI は渡されたファイルを全部頭に入れたまま考えられるけど、人間は読んだそばから忘れていくので、その都度自分の言葉に要約して次へ進む。この skill の規則はこの違いを前提にしている。人間の読み方の詳しい話は上の humanity-and-humanness にある。

## この skill が必要な理由と達成したい状態

この skill が必要な理由は AI が文を「読者に何を判断させるか」から組み立てていないことにある。学習した説明文の形をそのまま当てはめるので、形は整っていても読み手が受け取るべき判断とその理由が文に入っていないことが多い。

人間は推測で補いながら読むので、文章には推測の材料が要る。材料がない文章は、読んでも頭に残らない。

この skill で達成したい状態は読み手が一度読むだけで書き手の判断とその判断に至った理由を受け取れることである。そして最後まで読み進められることである。

## 使い方

規範は文型や禁止事項のチェックリストとして機械的に当てはめるものではない。先に決めるのは「どう直すか」ではなく「その修正で文章の何を守るのか」である。形が規範どおりでも働いていなければ外し、形が違っても働いていれば残す。判断の基準は形式ではなく文章が果たしている働きである。

規則は作業の段ごとに引く。各段で読む規則は次の節に置く。

## 作業の段と読むもの

<!-- writing-stages:start -->

### 決める

- [`purpose`](references/purpose.md)。目的を先に置き、理由を書く。理由は要件に届くまで遡る

### 組み立てる

- [`composition`](references/composition.md)。文書の種類、枠組み、段落、見出し、示し方、陳腐化の排除

### 書く

- [`punctuation`](references/punctuation.md)。句読点は役割の境界と意味が確定する場所に打つ
- [`rhythm`](references/rhythm.md)。読み物の緩急を認知モードの切り替えとして設計する

### 確かめる

- [`ai-style`](references/ai-style.md)。AI 文体の型に当てはめて、組み立てた文章が崩れていないかを確かめる
- [`evidence`](references/evidence.md)。ai-style の付属資料。型の出典と計測。記事の確かめる段では表を使う

<!-- writing-stages:end -->

## 用途

<!-- writing-usecases:start -->

選んだ手順も読むこと。

- [`ai-context`](usecases/ai-context.md)。SKILL.md、AGENTS.md、CLAUDE.md のように、AI が読む文書を書く
- [`readme-md`](usecases/readme-md.md)。人間が、使うかどうかを決めて使い始めるための README.md を書く
- [`novel`](usecases/novel.md)。小説を書く

masseater の名前で出す記事は、共通手順の [`article`](usecases/article.md) を読み、次の 6 つの種類から 1 つを選んで書く。依頼の言葉から種類が決まらないときはたたき台を書く前に本人に確かめる。種類を取り違えると、構成から書き直しになるためである。

- [`article-research-memo`](usecases/article-research-memo.md)。**調査メモ**：自分向けに調べた事実の記録。前置きと正当化を書かない
- [`article-poem`](usecases/article-poem.md)。**ポエム**：個人の主張を一人称の実感で吐き出す文章。論証しない
- [`article-essay`](usecases/article-essay.md)。**論説**：外部の人に読んでもらう寄稿レベルの記事。根拠を置き、読み手の疑問をつなぎながら主張へ進む
- [`article-tech-article`](usecases/article-tech-article.md)。**技術記事**：リポジトリ、ライブラリ、ツールの紹介と解説。対象が軸で、独自の主張を足さない
- [`article-scrap`](usecases/article-scrap.md)。**scrap**：外部の記事や事実へのリンクに、要約を 1、2 文添えたもの
- [`article-oshiete-claude`](usecases/article-oshiete-claude.md)。**教えてClaude**：本人が素朴な疑問を Claude と壁打ちした会話を、軽く整えてそのまま載せたもの

<!-- writing-usecases:end -->
