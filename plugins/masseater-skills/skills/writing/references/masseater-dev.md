# masseater.dev での置き場所

masseater/masseater.dev の AGENTS.md の「記事」節も読むこと。

| 種類 | 置き場所 |
| --- | --- |
| 調査メモ、ポエム、論説、技術記事、教えてClaude | `apps/portfolio/content/blogs/` |
| scrap | `apps/portfolio/content/scraps/` |
| Zenn に出す技術記事 | `apps/zenn-articles/articles/` |

- frontmatter の項目は `apps/portfolio/src/entities/entry/model/entry.ts` の `Frontmatter` に従う
- `apps/portfolio/content/` の文章は `.textlintrc` の検査を通す。本文は「である」調になる
- Zenn の記事は textlint の対象外で、既存の記事は「です・ます」調で書かれている
- AI が書いた blog は PR か下書きとして渡す。blog は本人が推敲してから出す
