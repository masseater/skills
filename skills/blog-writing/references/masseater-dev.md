# masseater.dev での置き場所

masseater.dev のリポジトリ（masseater/masseater.dev）に記事を置くときの参照である。リポジトリの AGENTS.md の「記事」節も読むこと。

| 種類 | 置き場所 |
| --- | --- |
| 調査メモ、ポエム、論説、技術記事 | `apps/portfolio/content/blogs/` |
| scrap | `apps/portfolio/content/scraps/` |
| Zenn に出す技術記事 | `apps/zenn-articles/articles/` |

- frontmatter の項目は `apps/portfolio/src/entities/entry/model/entry.ts` の `Frontmatter` に従う
- 中身の薄いアイデア段階の blog は `stage: idea` にする
- `apps/portfolio/content/` の文章は `.textlintrc` の検査を通す。本文は「である」調になる
- Zenn の記事は textlint の対象外で、既存の記事は「です・ます」調で書かれている
- blog を MCP から投稿する経路は意図して作っていない。blog は本人が推敲してから出すので、AI が書いた blog は PR か下書きとして渡す
