---
name: measure-postmortem
description: Read a PR and consider whether its fix could have been prevented or detected if it had been measured in advance. Use when looking back on a PR that fixed a bug, or when looking for gaps in measurement.
---

# measure-postmortem

Read a PR and consider whether its fix could have been prevented or detected if it had been measured in advance. Add the measurements you judged would have prevented or detected it, following measure-everything.

## Why this skill is needed and the state it should achieve

This skill is needed because once a PR is merged, the problem is treated as solved, and the lack of measurement that should have reported the problem before anyone else remains as it was. The gap stays invisible until the same kind of problem happens next time.

The state this skill should achieve is that, for each kind of problem that was fixed, measurement will report it before people do next time.
