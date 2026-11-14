# Writing README.md

Also read [`show-dont-describe`](../references/show-dont-describe.md).

Write README.md for humans. Put instructions for AI in AGENTS.md or CLAUDE.md, following ai-context.

A README contains only the following two things. Write both concisely.

- What this project achieves
- How to use it

Measurement results comparing performance or accuracy are material for deciding whether to use it, so include them in "what it achieves". Add the date and environment of the measurement, and show the command to measure again.

## Readers

People who open a README are trying to decide whether to use this project. What they want to know is whether it solves their problem and whether they can start using it right away. How it works inside is outside their interest until they decide to use it.

When explanations of the mechanism are mixed in, readers have to look for the answer while skipping sentences that do not concern them. If they cannot decide at the opening, they close it without reading further.

## What it achieves

Make it possible to decide whether to use it from the title and the opening alone.

- In the first sentence, say what it achieves. Do not start with how it was made or how the technology was chosen
- Write whose problem it solves and what problem that is
- If there is a place where it is published or installed from, put the URL near the opening

## How to use it

The usage section is the section readers read while working with their hands.

- Write the runtimes and accounts it presupposes before the steps
- Write commands in a form that works as is when copied
- Show one minimal working example
- Do not insert background or design explanations in the middle of the steps

Use bullet points only for parallel items with no order. Write premises and the flow of steps in sentences, and keep bullet points within 15% of the body. This is because yomiyasu's `--strict`, which is in the verify of masseater's repositories, fails when it goes over that.

## Fixing an existing README

Facts in a README are not fixed automatically when the code or settings change. Before fixing the wording, check the written facts against the real thing.

- Confirm that commands are tasks that still exist in `package.json` or `vite.config.ts`
- Confirm that the tables of secrets and environment variables are still read by the workflows and the code
- Delete facts that have disappeared, and fix facts that have changed

## What not to write

Do not write information that is unnecessary for deciding whether to use it and for starting to use it, whether or not there is another place for it.

- Architecture, data flow, directory structure, internal modules
- Information derivable from the code, such as API lists and configuration options. Point to it following no-perishable-information
- Reasons for the design. Put them in commit messages or DESIGN.md
- Instructions for AI and working rules. Put them in AGENTS.md or CLAUDE.md
