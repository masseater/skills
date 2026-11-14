# Where things go in masseater.dev

Also read the "Articles" section of AGENTS.md in masseater/masseater.dev.

| Kind | Location |
| --- | --- |
| Research memos, poems, essays, tech articles, Oshiete Claude | `apps/portfolio/content/blogs/` |
| scrap | `apps/portfolio/content/scraps/` |
| Tech articles published on Zenn | `apps/zenn-articles/articles/` |

- Frontmatter fields follow `Frontmatter` in `apps/portfolio/src/entities/entry/model/entry.ts`
- Text in `apps/portfolio/content/` must pass the `.textlintrc` checks. The body is in the plain "である" style
- Zenn articles are not checked by textlint, and the existing articles are written in the polite "です・ます" style
- Hand over a blog post written by AI as a PR or a draft. The owner revises a blog post before publishing it
