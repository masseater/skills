# masseater.dev の配置先

また、masseater/masseater.dev の `apps/portfolio/AGENTS.md` にある「記事」セクションも参照すること。

| 種類 | 場所 |
| --- | --- |
| 研究メモ、詩、エッセイ、技術記事、教えてClaude | `apps/portfolio/content/blogs/` |
| scrap | `apps/portfolio/content/scraps/` |
| Zenn で公開されている技術記事 | `apps/zenn-articles/articles/` |

- フロントマターフィールドは `apps/portfolio/src/entities/entry/model/entry.ts` の `Frontmatter` に従う
- `apps/portfolio/content/` 内のテキストは `.textlintrc` チェックに合格する必要がある。本文は単純な「である」スタイルである。
- Zenn の記事は textlint によるチェックを受けず、既存の記事は丁寧な「です・ます」スタイルで記述されている。
- AI が執筆したブログ記事を PR または下書きとして渡す。オーナーはブログ記事を公開する前に修正を行う。
