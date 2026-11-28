# 現在の関心事

このファイルはコンテキストであり、ルールではない。今masseaterが何を重視しているかを記録しており、それによって選択が同様に傾くようになる。関心は変化する。

最新のエントリが現在のものである。古いエントリは履歴であり、現在は適用されない。

関心が変わったら、上部に新しいエントリを追加する。古いエントリは編集しないこと。

## 2026-11-28

- 人間の認知負荷を軽減する。つまり、人が読み、念頭に置き、手入力しなければならない内容のことである。
  - スキル：`cognitive-load`、`infographic`、`gitbook-pages`、`slide-content`、`humanity-and-humanness`、`human-judgment-line`、`measure-dont-guess`、`masseater-style`。
  - これらを強制するフック：[cogloadフック](https://github.com/masseater/skills/tree/main/plugins/cogload/hooks)（スキル優先、簡潔なレポート、非公式ソースの確認）および[Stopスタイルチェック](https://github.com/masseater/skills/blob/main/plugins/masseater-skills/hooks/stop-style-check.ts)。
  - 計測：[lap](https://github.com/masseater/masseater.dev/tree/main/tools/lap)、[lapse](https://github.com/masseater/masseater.dev/tree/main/libs/lapse)、および[work-metrics](https://github.com/masseater/masseater.dev/tree/main/tools/work-metrics)。
- 人が欲しいものを言葉にしやすくする。
  - [Sashi](https://sashi.masseater.dev)は、masseater が欲しいものの代わりに指し示す参考例を集める。
  - 判断モデルが選択式の問いに答える。[oxlint-plugin-decision](https://github.com/masseater/ecosystems/tree/main/libs/oxlint-plugin-decision)と cogload の判断フックがある。
  - [intent-book](https://github.com/masseater/ecosystems/tree/main/libs/intent-book)は、エージェント向けのスキルを人間向けのドキュメントにし、どちらも同じ元を読む。
- リポジトリに残らない運用：
  - [タスクグラフ](https://claude.ai/artifact/6TcZa8WS9sPpaxqHyyM9Ug)のアーティファクトで、作業の状況を視覚的に示す。
  - 図のアーティファクトで、スケジュール済みタスクの台帳を示す。
  - GitBook形式の提案ページと解説のアーティファクトで、長いチャットの文章の代わりにする。
  - コーディネーターは、masseater の判断が要ることだけを、短い投稿で伝える。
  - 選択肢は判断カードで示す。
  - masseater に判断を求める前に、インフォグラフィックを描く。
  - インフォグラフィックのツール kata は開発中である。
