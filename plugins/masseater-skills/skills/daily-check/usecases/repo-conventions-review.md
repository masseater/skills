# Review repository conventions

Bring every repository to every viewpoint in the repo conventions, not only the layering and colocation ones.

1. For each repository, compare the code and structure with the conventions. Do not stop at an absent warning: a slice that should exist, a layout that will not scale, and responsibilities mixed in one slice are findings.
2. For violations that no check detects, propose a msch check that would detect them in every repository.
3. For violations that are hard to detect mechanically, propose the refactor: create the slice, regroup into a shape that scales, merge duplicated pieces.
4. Conflicts with other threads touching the same files are not a reason to leave a finding out; name the thread and send the finding there.
