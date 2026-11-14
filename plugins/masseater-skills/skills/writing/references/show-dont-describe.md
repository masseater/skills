# Show without explaining

Procedural and reference documents such as README, documentation and SKILL.md are a UI that readers operate. Readers find the part they want by its heading and copy commands and settings to use them. Running prose is an obstacle they have to read before using them. Keep a sentence only when readers would actually make a mistake without it.

- Do not explain what the document or the section is. The title, headings, lists and code blocks convey that
- Do not narrate the operations. Do not add "run the following" or "write it in ..."; put the code block under the heading
- Do not write sentences that confirm the result of an operation. Readers can see it on the screen right there. However, when nothing is output on success, or when success and failure look the same, show the output on success in a code block
- Do not list several means that lead to the same result. Narrow it down to one
- When there are several results, write only the most important one. Always keep results that cannot be undone
- Do not write what happens internally. Storage locations, synchronization and background processing are outside the reader's interest
- Do not write what does not exist or what cannot be done. Keep, in one line, only what readers would try and fail at
- Make conditions headings, not preambles to sentences. Rather than "When using it in a team", have a section "Using it in a team"
- Use verbs that make clear what happens. "Install" and "enable" rather than "put in" or "set up"
