# Articles published under masseater's name

## Why articles need this and the state they should achieve

AI builds an article not from who reads it and for what, but from the plausible article shapes it learned. As a result, a memo for oneself gets a preamble and justification for readers, a poem that pours out a personal claim gets responses to counterarguments and tables of data, and a contributed-level article piles up previews such as "what can be read from ..." and sentences that merely rephrase the same claim. The same habits appear even when the model is changed, so the owner ends up repeating the same feedback for every article.

The state to achieve is that the thoughts in the owner's head and the facts they researched become text, in a form suited to that kind of article, that the owner can publish without fixing.

## Write from what you want to convey

Before writing, decide what the whole article wants to convey and what each paragraph wants to convey. Sentences are placed to convey that to readers; do not write sentences that do not contribute to it. AI tends to fix wording and conformity to individual rules part by part, and text fixed that way conforms to the rules sentence by sentence but no longer shows what each paragraph wants to convey.

- For each paragraph, confirm that you can say what it wants to convey in one sentence before writing it
- Place cases and numbers as grounds for what you want to convey. Do not start with a case and leave readers to infer what you want to convey
- When fixing after feedback too, do not replace just that sentence; rebuild the sentences from what the paragraph wants to convey
- The rules below and [`ai-style`](ai-style.md) are for checking the text you built, not for replacing sentences to fit the rules

## Structure

Structure every kind mainly with headings and tables.

- Add only as many headings as the map of the whole needs; do not add one per paragraph
- Put items being compared in a table
- Keep bullet points within 15% of the body. This is because the yomiyasu lint in masseater.dev's verify fails when it goes over that
- Put only one claim in one paragraph, and leave a hook to the next paragraph
- If there is a way to convey something without prose, such as a figure, table or code, use it

## Titles and headings

Make the title the shortest noun phrase that shows what the article is about. Write it like "typescript-template の中身（2026年10月24日時点）" (the contents of typescript-template, as of October 24, 2026), and do not add an explanation of the content with a subtitle such as ": start a TypeScript app that runs on Cloudflare with checks and CI in place". Leave the explanation to the description and the opening of the body. For articles that depend on a point in time, keep "（YYYY年M月D日時点）" (as of YYYY-MM-DD).

Keep headings short in the same way, without piling up modifiers and supplements.

## Rules common to all kinds

Also read [`ai-style`](ai-style.md). After writing, check against the tables in [`evidence`](evidence.md).

- Do not write modifiers and supplements that do not contribute to the claim. Do not squeeze numbers out of things such as the repository history for backing
- Do not add claims of your own that stray from the axis of the request. Confirm the axis of the article in the owner's words, and do not replace it with your own summary
- Do not paraphrase the owner's words. If they said "複利" (compound interest), write "複利", and do not extend it to metaphors such as debt or interest payments
- Write English terms such as EOL, shared responsibility model and penetration test as they are. Replacing them with plain Japanese makes them look like something else to readers
- Do not create coined compressed expressions; write in ordinary business terms. Write "停止した" (suspended) rather than "止めた" (stopped), and "決断する" (make a decision) rather than "決める" (decide)
- Attach sources as footnotes with named labels such as `[^codmon-retrospective]` at the place where the fact is written. Numbers are assigned automatically in order of appearance at render time and gathered into the list at the end, so write neither numbers nor the list by hand
- Separate sources from links readers follow. Make sources that show grounds footnotes, and embed destinations you want readers to open, such as the official site of a tool being introduced or related articles, in a word of the body with `[text](URL)`
- Do not write sentences that only list cases; link to an article that collects them
- Do not list configuration values that can be learned by reading the code (plugin names, banned libraries, task lists and so on). Write only the mechanism and the intent
- At the end of an article, do not write how readers can get started, what to do next, or calls to action. Do not include them even at the outline stage
- Before writing, ask the owner only about the axis of the article, and receive the rest by showing the outline. Material does not come out just by asking; it is recalled by seeing the outline
- Put half-width spaces before and after Latin-alphabet words, but not around numbers ("PHP 8.1 以前", "21日9時")
- Do not write items that can act as constraints, such as a target character count, in either the outline or the body
- Do not write notes of the writer's interpretation or items to confirm in the outline or the body. Ask disclaimers such as "I interpreted CVA as a typo for CVE" in the reply to the owner

## Where it goes

Also read [`masseater-dev`](masseater-dev.md).
