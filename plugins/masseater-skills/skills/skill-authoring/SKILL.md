---
name: skill-authoring
description: Read when creating, fixing or correcting an Agent Skills skill, that is, a `SKILL.md` and its directory. Write the body by deriving it from why the skill is needed and the state it should achieve, and when fixing, derive the whole again.
metadata:
  derived-from: >-
    https://github.com/cursor/plugins/blob/bebaffe14f8f442b98e9c409e960aedad59b5fc8/pstack/skills/poteto-mode/playbooks/authoring-a-skill.md
    https://github.com/nicobailon/skill-diet/tree/5f41df1220eb5759c413390206f1b9e6c63be754
---

# skill-authoring

- Follow https://agentskills.io/specification for structure and frontmatter
- Follow writing for prose
- Follow humanity-and-humanness for how the user reads and thinks
- For how to write for the reading model, follow https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices and the guides reachable from it

## Why this skill is needed and the state it should achieve

This skill is needed because the AI writing a skill does not have the user's judgments. The writing AI fills the missing parts with its own knowledge or generic document templates, and what it filled in remains in the skill looking just like the user's judgments. The AI that reads it executes them as the user's judgments.

The state this skill should achieve is that a skill consists only of the user's judgments.

## The section on why it is needed and the state it should achieve

In situations where the rules do not apply, the model judges from this section. So put one in the body, separate from procedures and rules.

- Put one paragraph that begins with "This skill is needed because"
- Put one paragraph that begins with "The state this skill should achieve is"
- Do not write what this skill does. That is the rules of the body themselves

For why it is needed, write not only what goes wrong but the mechanism by which it happens. If the mechanism is written, even in unexpected situations you can judge by whether the same mechanism is at work.

For the state to achieve, write the state reached by continuing to follow the skill, in a form not tied to means. Leave procedures and concrete criteria to the rules.

If the two become flip sides of the same thing, the resolution of the problem is insufficient. If you write only the symptom, the state to achieve can only be its negation. A skill whose mechanism cannot be written is not yet at the stage of being made.

## What to write

What you write in the body is only the judgments the user showed through requests and feedback, and what can be derived from why it is needed and the state it should achieve. The judgments belong to the user; you are responsible for how to put them into text.

### Placement

Put each fact in the tier that reaches the model before it needs it and is read the fewest times. The higher the tier, the more situations it is read in, and it uses context each time.

- `description` is read in every session. Put only the cues for recognizing when to use it
- `SKILL.md` is read every time the skill is used. Put why it is needed, the state it should achieve, and the rules needed in every situation
- In `usecases/`, put procedures needed only in some situations. Make the headings verb phrases of "do ...", not "when doing ..."
- In `references/`, put references needed only in some situations. References specific to a particular repository or environment, and the details of rules, fall under this
- Move up into `SKILL.md` any `usecases/` or `references/` that are read in most situations
- Do not make the model read scripts, templates or materials; have it run or copy them

Write links to `usecases/` and `references/` following ai-context in writing. Which situation they are read in is determined by the section where the link is placed.

### Drawing out judgments

Users have not verbalized all their judgments. Just asking does not bring them out.

- Write a draft and show it, and read the judgments from the reaction
- Do not decide everything yourself. Do not ask about everything either
- Do not embed in the draft judgments that sway why it is needed or the state it should achieve. Present the options and your recommendation, and let the user decide

### Do not fill

Do not fill places the user has not decided with your own knowledge or generic document templates. What tends to get filled in is the following.

- Sections of premises, cautions and supplements that were not requested
- Reminders
- Phrasing only the writer understands

Delete the following. When in doubt, delete.

- Sentences that do not change judgments, and words whose removal does not change behavior
- What the model does without being told. Definitions, common practices and examples of obvious ideas fall under this
- What only humans need. Write history, the events that triggered something, and measured values in commit messages
- A second instance of the same meaning. Across `SKILL.md`, `references/`, `usecases/` and tool documentation, put each meaning in one place

However, for irreversible operations such as writes, sending data off the machine and paid quotas, keep two or three lines of safety rules even if the model knows them.

When every line changes the model's behavior and no meaning appears twice, the writing is done.

### Delegating

- When delegating to another skill, write only the skill name. Do not restate its content
- Point to structural sources of information such as types, READMEs and settings. Do not copy them
- In a skill that teaches how to use a tool, leave exact names, arguments and values to the tool's help and errors. Write in the skill only the commonly used calls and the shapes of calls the model gets wrong
- For instructions that repeat, do not add sentences; turn them into lint, metadata, runtime checks or scripts
- If there is a procedure you step through repeatedly that is not yet a skill, propose a new skill

## Style

The model extends rules from their reasons to situations that are not written. So attach a reason to each rule.

- Attach one sentence of reason to each rule. Do not attach one to rules that cannot be misread even without a reason
- Give rules short names the model already knows. If there is a known standard that covers many rules, write the standard's name and how far to follow it
- Instead of listing cases, write the idea that produces them
- Instead of listing "do not ...", write what to do instead as a single criterion. Use the prohibitive form only for safety rules that cannot be put in an affirmative form
- Do not generalize the forms you want avoided; name them concretely
- Do not write instructions that increase the amount of thinking or verification. When you want to decide how to check something, write the method, not the amount

An example of a method of checking is "look at the real thing, not a substitute".

## frontmatter

- Make `name` the same as the directory name. Make the first heading of the body the same name too
- In `description`, write what it does and when to use it. Include the words of the situations where it is used. It is read in every session, so write only one cue per situation
- For a skill only the user invokes, add `disable-model-invocation: true` and make `description` one sentence for the user. It stops using context until invoked
- Do not write a table of contents of the body in `description`. You would have to fix it every time `references/` or `usecases/` grows
- Do not write `license`. Do not create a LICENSE file either

### metadata.derived-from

In `metadata.derived-from`, write only the URLs of this skill's originals. An original is something whose content was taken in and adapted into this skill. It may be a skill or an article, and it is still an original even if it was rewritten after being taken in.

- Material you only read while writing is not an original. Link to it in the body
- Material cited in the body as grounds is not an original. Link to it where it is cited
- Skills the body delegates to by name are not originals
- Make GitHub URLs permalinks that specify a commit
- Do not write the originals' URLs, authors or versions in the body or `references/`

`metadata` values are strings only, so put multiple URLs in one string separated by whitespace.

```yaml
metadata:
  derived-from: >-
    https://github.com/<owner>/<repo>/blob/<commit>/path/SKILL.md
    https://github.com/<owner>/<repo>/tree/<commit>/path/another-skill
```

## Use cases

Read all of the following too.

- [`create`](usecases/create.md). Create a skill
- [`revise`](usecases/revise.md). Revise a skill after feedback
- [`diet`](usecases/diet.md). Slim down a whole skill
