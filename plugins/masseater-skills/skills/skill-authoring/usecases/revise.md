# Revising a skill after feedback

The body is the result of deriving it from why the skill is needed and the state it should achieve, not a history of additions made in the order requests came in.

1. Read the judgment not from the single sentence that was pointed out but from why the user pointed at that place
2. If it can be fixed below the skill, fix it there. Stop mechanical errors with tool errors, lint and tests. Use prose only where judgment is needed
3. If a new session behaves correctly without that rule, add nothing
4. Decide whether the reason it is needed or the state it should achieve changes, or whether one of the existing rules is insufficient
5. Derive the whole body again from there. Do not fix it by patching onto the current body
6. Do not rewrite the parts where the re-derived result is the same as the current body
7. Fix every other place to which the same reason applies
8. Try the situation that triggered the feedback again in a new session

The reason not to rewrite the parts that are the same is to avoid breaking the structure readers have memorized.

The patching that commonly happens in skills is adding the sentence that was pointed out to the end, and adding one more line to a heading or bullet list to make a separate item. If you fix only the place that was pointed out, other places with the same reason remain, and the same feedback comes again. Instead of adding, fix the line that already carries the same idea.

In the commit message, write the event that triggered the feedback and the size of `SKILL.md` (`wc -c`) before and after. Offset any increase by cutting elsewhere. If it has grown by 10 percent or more since the last slimming commit, or the same meaning appears in two places, slim it down with [`diet`](diet.md).
