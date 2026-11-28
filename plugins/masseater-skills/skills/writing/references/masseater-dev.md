# masseater.dev の配置先

また、[`apps/portfolio/AGENTS.md`](github:masseater/masseater.dev/apps/portfolio/AGENTS.md) にある「記事」セクションも参照すること。

| 種類 | 場所 |
| --- | --- |
| AI が書いた研究メモ、詩、エッセイ、技術記事、教えてClaude | `apps/portfolio/content/slog/`（サイト上は Slog） |
| masseater が自分で書いた文章 | `apps/portfolio/content/blogs/` |
| scrap | `apps/portfolio/content/scraps/` |
| Zenn で公開されている技術記事 | `apps/zenn-articles/articles/` |

- AI が書いた文章を `content/blogs/` に置かない。Blogs は人間が書いた文章だけの場所で、Slog のどの記事にも「AI（Claude）が書いた文章」の帯が付く。
- フロントマターフィールドは `apps/portfolio/src/entities/entry/model/entry.ts` の `Frontmatter` に従う
- `apps/portfolio/content/` 内のテキストは `.textlintrc` チェックに合格する必要がある。本文は単純な「である」スタイルである。
- Zenn の記事は textlint によるチェックを受けず、既存の記事は丁寧な「です・ます」スタイルで記述されている。
