---
name: integrate
description: Use when introducing a library or a new means of implementation. Do not stop at adding it; go as far as migrating existing code and mechanically enforcing the use of that means.
---

# integrate

- Move existing equivalent implementations to the new means
- Make it impossible to use the old means in new code
- Unify how the new means is used into one way
- Delete the old implementations and dependencies that are no longer needed

## Why this skill is needed and the state it should achieve

This skill is needed because even after a new means is introduced, the old means remains usable. Workers imitate the old means they are used to and the way nearby existing code is written, so the old and the new keep being used side by side.

The state this skill should achieve is that only the new means is used, and the old means cannot be used even without anyone trying to guard against it.

## Stop the old means with mechanical checks

What stops the old means is lint, types, CI and constraints on dependencies. `no-restricted-imports` is an example. Documentation, conventions and review comments are mechanisms that rely on the goodwill and effort of workers, so they are not a means of stopping it.
