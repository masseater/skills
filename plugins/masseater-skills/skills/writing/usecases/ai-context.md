# Writing context that AI reads

README.md follows readme-md.

- Put why it is needed and the state it should achieve at the top, written in human language
- Give each index entry a one-line summary
- When sending readers to another file, write "Also read X"

The structure and frontmatter of a skill follow skill-authoring.

## Readers

Context has two kinds of readers, and they read in opposite ways.

- AI takes what is written exactly as it is, and fills in what is not written with its own knowledge
- Humans read while filling gaps by guessing, and check whether the AI's understanding and their own have drifted apart

If you write with only AI as the reader, humans cannot cross-check. The AI keeps acting without the drift in understanding being found.

## Where cross-checking happens

Why it is needed and the state it should achieve are the places humans read first and cross-check against their own understanding. Write them so that reading only these is enough to judge whether they match one's own thinking.

- Write the mechanism and the final state
- Write in human language, not jargon

## Index summaries

Give the indexes of `references/` and `usecases/` a one-line summary per entry. Make AI read them with "Read all of them". For an index from which one is chosen per situation, make AI read with "Also read the X you chose". Humans scan the summaries and cross-check what the AI is reading against their own understanding. Without summaries, humans cannot know what the AI is following unless they open the files.

## How to write references

AI takes "read when ..." and "... is in X" as instructions that it need not read them now. If they are not read, no amount of upkeep matters.

- When sending readers to another file, write "Also read X" at the start of the relevant section
- Do not leave context that makes it seem fine not to read it
- It is fine if the context grows. It is enough if, after reading, one can judge that it was unnecessary
