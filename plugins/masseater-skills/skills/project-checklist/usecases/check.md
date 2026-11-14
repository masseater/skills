# Checking and judging the current state of a project

1. Decide the target repository and the production URL. If you are told to use a different repository, work there. If there is no production environment, mark the items checked in production as "unchecked"
2. Read the target's AGENTS.md and CLAUDE.md, and note any rules that override the conditions for being satisfied
3. Make a list of pages and APIs from the routing definitions. "Each page" in each file refers to this list
4. For each file in `references/`, check each item with its "How to check the current state". Note the files you checked, the commands you ran and their output
5. For a repository created from the template, [match it against the template's skeleton](#matching-against-the-templates-skeleton)
6. Output a table with the columns area, item, current state, verdict and grounds for each item
7. After the table, list the items that are "insufficient" and "unchecked"

Extract and note, as they are, the parts of command output that bear on the verdict. They are the grounds for the verdict.

## Matching against the template's skeleton

1. Bring the actual template up to date. If it is in `ghq list -p`, update that clone; if not, get it with `ghq get masseater/typescript-template`. In an environment without ghq, `gh repo clone` it into a temporary directory
2. Match each element of [`typescript-template`](../references/typescript-template.md), in order, against the actual template
3. Run `vp install` and then `vp run verify` in the target repository. If verify fails, treat the failed tasks and their output as the first insufficiencies
4. Align the GitHub-side settings with the procedure in [setup](setup.md), and carry it through "Confirming the changes took effect"

For the verdict, mainly use the following material.

- Open the skeleton files side by side with the template
- Check the hook settings with `git config core.hooksPath`
- Check main's CI with `gh run list --branch main --limit 5` and `gh run view <run-id> --log`
- Check skills with `skills ls` and `vp exec intent list`
