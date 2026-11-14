---
name: writing
description: Read when writing or revising text. Covers documentation, comments, commit messages, PR bodies, READMEs, articles published under masseater's name, and novels. Also use when fixing text described as "AI-like", "redundant" or "hard to read", and when asked to "turn this into an article" after bouncing ideas off Claude.
metadata:
  derived-from: >-
    https://github.com/masseater/claude-code-plugin/tree/2e0619b1ab620552764da5ea6e46b77a0dcfaa35/plugins/writing
    https://github.com/cursor/plugins/blob/837067b75aa20ab58d7b2a2f6c0531e37118c596/pstack/skills/technical-writing/SKILL.md
    https://github.com/azukiazusa1/skills/tree/a7f996f1cd700a4a56827f6cf2a130ff5a9ceedf/skills/writing/write-blog-article
    https://github.com/artouc/stop-describe-ui/blob/251a859f6e40645030e1ae69fa4b501c851eac9c/skills/stop-describing-ui/SKILL.md
---

# writing

- Follow humanity-and-humanness for how human readers read and think
- Follow [`japanese`](https://github.com/philtzjp/skills/blob/main/.agents/skills/japanese/SKILL.md) in philtzjp/skills for Japanese phrasing
- The norms of this skill are added on top of those

## Why this skill is needed and the state it should achieve

This skill is needed because AI reflexively builds sentences from the shapes of explanatory text it learned, not from what it wants readers to judge. Moreover, AI takes as its model of the reader itself, which can take what is written exactly as it is, so for humans, who read while filling gaps by guessing, the text does not stay in the head even when read.

The state this skill should achieve is text from which readers receive the writer's judgments and their reasons in a single reading, and which they keep reading to the end.

## Overarching principles

The norms are not to be applied mechanically as sentence patterns or prohibitions. What to decide first is not "how to fix it" but "what in the text this fix protects". Judge by the function the text performs, not by its form.

### Structure suited to how readers read

Humans read in order, and build understanding in the order they read. They grasp the whole by scanning it before going into details. Fit the structure to that way of reading.

- Put only one kind into one document
- Before listing rules, write what would happen without those rules
- Make it possible to tell from the title and opening alone what the document is and what it protects
- Write what the document is in a paragraph of short sentences, and list what it protects as bullet points
- Make parallel items a list. Do not fold them into prose
- Give indexes to other files and sections a one-line summary
- Put only one independent judgment in one sentence
- Headings at the same level answer the same question
- Give headings the point, not the topic name. Make procedural headings verb phrases and conceptual headings noun phrases

There are four kinds of documents: procedures for work, references that are facts for work, explanations for understanding, and procedures for learning. Readers change how they read for each kind, so if you write background inside a procedure or persuasion inside a reference, readers cannot switch how they read. If you feel like mixing them, split the documents and link them.

If the viewpoints of headings at the same level are not aligned, readers cannot grasp what axis things are divided on even when scanning. Do not line up rule sections, procedure sections and subject sections at the same level.

If you list rules first and add reasons afterward, no questions arise, so no flow is created.

### Designing rhythm

Also read [`rhythm`](references/rhythm.md).

Dense text becomes boring not because there is a lot of information. It is because all of it is written in the same cognitive mode. Switch the reader's cognitive mode among observing, hesitating, being convinced and rechecking, and always leave a "reason to keep reading".

- Design rhythm not as an increase or decrease in information but as switching of cognitive modes
- Always keep at least one unresolved tension open
- Write not in the voice of explaining a finished conclusion but in the voice of a participant moving forward while thinking
- Take the material for beats, tension and release only from the side of the situation
- Realize devices through content, and do not declare them
- Do not cut sentences to create beats

The moment all tensions close, readers can stop reading. Unresolved tensions are questions not yet answered, convictions not yet verified, and answers promised for later.

The situation is the events, data and remarks of the subject world, and the state of judgment of the narrator. In explanatory text without scenes, the properties of the subject itself and the inferences and counter-questions readers have are the situation. Leave positions where the situation offers no material flat, without adding anything. Creating rhythm with sentences that make the text itself the topic violates the norms.

A sentence that states an operation about to be performed, such as "put half the answer first", is itself bad writing. If a device works, readers do not notice its existence.

Shortening by cutting the context needed for an introduction, such as scope, viewpoint, axes of comparison and undecided items, is not rhythm but omission. Edit to raise density only on top of already shared context.

## Norms

When writing explanatory text, read all of the following too.

- [`purpose-and-reason`](references/purpose-and-reason.md). Write the purpose and the reason
- [`no-perishable-information`](references/no-perishable-information.md). Do not copy into documents information derivable from code
- [`punctuation`](references/punctuation.md). Place punctuation at the boundaries of roles and where the meaning is settled
- [`purpose-before-means`](references/purpose-before-means.md). Put the purpose before the means
- [`headings`](references/headings.md). End headings and bullet points with a noun
- [`show-dont-describe`](references/show-dont-describe.md). Treat procedural and reference documents as a UI, and show with headings and code blocks without explaining

## Use cases

Also read the procedure you chose.

- [`ai-context`](usecases/ai-context.md). Write documents AI reads, such as SKILL.md, AGENTS.md and CLAUDE.md
- [`readme-md`](usecases/readme-md.md). Write a README.md for humans to decide whether to use something and to start using it
- [`novel`](usecases/novel.md). Write a novel

For articles published under masseater's name, choose one of the following six kinds and write it. If the kind is not determined by the wording of the request, confirm with the owner before writing a draft. If you mistake the kind, you have to rewrite from the structure up.

- [`article-research-memo`](usecases/article-research-memo.md). **Research memo**: a record of facts researched for oneself. Do not write a preamble or justification
- [`article-poem`](usecases/article-poem.md). **Poem**: text that pours out a personal claim with first-person feeling. Does not argue
- [`article-essay`](usecases/article-essay.md). **Essay**: a contributed-level article for outside readers. Places evidence and proceeds to the claim while connecting the reader's questions
- [`article-tech-article`](usecases/article-tech-article.md). **Tech article**: introduction and explanation of a repository, library or tool. The subject is the axis; do not add claims of your own
- [`article-scrap`](usecases/article-scrap.md). **scrap**: a link to an external article or fact with a one- or two-sentence summary
- [`article-oshiete-claude`](usecases/article-oshiete-claude.md). **Oshiete Claude**: a conversation in which the owner bounced a naive question off Claude, lightly tidied and published as is
