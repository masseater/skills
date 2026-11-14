# Eliminating async waterfalls

Do not wait in sequence for operations that do not use the previous result.

- Start independent operations at the same time
- Wait after entering the branch that uses the result
- Check conditions you already have first
- When only part depends on something, make only the dependent part wait
- Do not hold the shell until the data completes

## Wait after entering the branch that uses it

If there is a branch that does not use the result, wait after entering the branch that does. If you wait first, even a branch that returns immediately stops until the I/O finishes.

## Check cheap conditions first

When you need both a network or DB result and a condition you already have, as in `flag && localCondition`, check the local condition first.

Keep the original order in the following cases.

- When the local condition depends on the result of the flag
- When the condition is the heavier one
- When the order of side effects is part of the specification

## When only part depends on something

Even when `profile` waits for `user`, do not make `config` wait for `user`. How to write it is as in the example in `SKILL.md`.

## APIs and server processing

Do not line up reads that do not need a session behind authentication. Make authentication the dependency, and build it in the same shape as when only part depends on something. The same goes for Elysia routes and TanStack Start server functions.

## Do not hold the shell until the data completes

Do not hold the rendering of navigation, headers and footers until the main data finishes.

- Put only the parts that need data inside `<Suspense>`
- Wait outside the shell only for values required to branch the layout
- For a small query where the Suspense switch would be more noticeable, you may wait together with the shell
