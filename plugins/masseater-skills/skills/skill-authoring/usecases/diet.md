# Slimming a skill

Do this for a skill that has grown large, a skill that makes readers read details not used in most situations, and a skill whose content has drifted from what it teaches.

1. Copy the current skill elsewhere as **before**. Record with `wc -c` the size of `description`, `SKILL.md`, and each file in `references/` and `usecases/`
2. List the users of this skill: skills that link to it, skills that delegate to it by name, AGENTS.md, and tests that read the body
3. While only **before** exists, write the evaluation scenarios. Choose about ten from requests that actually used this skill, including one each of the scenarios in `usecases/` and `references/`, the "do not" rules, and the areas of irreversible operations
4. If the skill teaches how to use a tool, remove from the skill the parts that the tool's help and errors cover. For the parts they do not cover, fix the tool if you can, and keep them in the skill if you cannot
5. Assign each part of the body to a tier of placement
6. Cut by the "do not fill" criterion, and rewrite by the "style" criterion. End the last paragraph with a rule, not a history aimed at the user
7. Give **before** and **after** to a new session and have it confirm that each rule in **before** has a place in **after** or was cut by the criterion in 6. For anything that is neither and that none of the scenarios in 3 covers, write one scenario and try it three times with **after**. If it is not correct all three times, restore it
8. Try the scenarios from 3 in three ways, without the skill, with **before** and with **after**, each in a new session. Rules for scenarios that behaved correctly without the skill may be deleted
9. Pass `skills-ref validate`, and confirm that the references from the users listed in 2 are not broken

Land **after** if it is smaller than **before** or fixes a drift, and is not worse than **before** in 8. If a scenario got worse, look in the logs for what the model was missing, and move that to a higher tier before restoring the text.

In the commit message, write the size of each tier before and after, the results of 8, and what was moved where and what was cut.

If the slimming reveals errors or gaps in this procedure, fix skill-authoring with [`revise`](revise.md).
