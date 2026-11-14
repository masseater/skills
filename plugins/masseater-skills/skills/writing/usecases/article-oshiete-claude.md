# Writing an Oshiete Claude article

Also read [`article`](../references/article.md).

The series is grouped by the masseater.dev tag "教えてClaude" (Oshiete Claude, "Tell me, Claude"). What readers follow is the flow of what the owner wondered about and what they became curious about next after Claude's explanation, so rewriting the conversation as expository prose erases that flow.

- When asked to "turn this into an article" in a session where you bounced ideas around, write it using that session's conversation as material
- Do not change the order or content of the remarks
- Enclose the remarks of each speaker in `:::masseater` and `:::claude` blocks
- Put "教えてClaude" in the frontmatter `tags`, and place the file in `apps/portfolio/content/blogs/`

```md
:::masseater
HTTPS の鍵マークって、結局だれが本物だって保証してるの？
:::

:::claude
認証局（CA）と呼ばれる事業者だ。サイトの運営者がドメインを管理していることを CA が確かめ、ドメイン名と公開鍵を結びつけた証明書に署名する[^mdn-tls]。
:::
```

## What to tidy

| Target | How to tidy |
| --- | --- |
| Exchanges other than the brainstorming | Cut digressions, tool results and the request to turn it into an article |
| The owner's remarks | Fix only typos and hesitations, and keep the tone |
| Claude's remarks | Shorten them by cutting preambles, repetition and closing summaries. Do not add to the content of the explanation. Make sentence endings consistently the plain "だ・である" style, because masseater.dev's textlint rejects "です・ます" in the body |
| Headings | Put them only where the topic changes |

Make the title the owner's question as the shortest noun phrase ("HTTPS の証明書を保証する仕組み", the mechanism that guarantees HTTPS certificates).

## Checking facts

Claude's explanations are sometimes wrong. Before turning it into an article, check the facts in Claude's remarks against primary sources and attach the sources as footnotes. Do not rewrite a remark in which an error is found; attach a footnote to it and write the correct fact and source. This keeps the record of the brainstorming honest.
