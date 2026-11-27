# sweep

Run fallow similar-code across all checked-out repositories and get the pairs that cross repositories.

```bash
node ${CLAUDE_SKILL_DIR}/scripts/sweep.ts --repos <parent directory of the checkouts> --out <result.json>
```

- The first run installs the pinned `fallow` and the local model if the session-start hook has not finished yet, so it may take several minutes. Later runs read cached vectors and take seconds per part.
- The script tries all repositories as one root. If that root reaches fallow's function limit, it falls back to repository pairs, and splits the larger side of a pair by directory until each part fits. It seeds each part with the files of every repository but the largest, so that every cross-repository pair is compared, and it reruns a part until the embedding is complete.
- `result.json` has `complete`, the `roots` it ran, `unresolved` parts it could not shrink, `failedPhases`, and `pairs` (sorted by similarity, each side with `path`, `name` and lines). A non-zero exit code means `complete` is false.
- `fallow similar-code` ignores tests, fixtures, patches, generated files, `dist` and vendored code. The paths in `pairs` start with the repository directory name.
