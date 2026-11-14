# Creating a skill

1. Create `SKILL.md` with `skills init <name>` from the skills CLI
2. Write the body by deriving it from why the skill is needed and the state it should achieve
3. Pass `skills-ref validate <dir>`
4. Confirm that the referenced files and the skills delegated to by name exist
5. Write test cases if the content is structural. Do not write them if it is subjective
6. Open a PR following the repository's procedure

A skill used across multiple repositories goes in `skills/` of masseater/skills. A skill placed there is also included in the Claude Code plugin `masseater-skills`.

In the reply, write a summary of the skill, the main design decisions, and the results of the validation.
