# Check upstream exits

Find upstream deviations whose exit condition is now met.

1. In masseater.dev, read the latest run of `daily.yml` and its root `daily` job through the GitHub MCP tools. The job runs `msch-exits` where npm, crates.io and GitHub lookups work; cloud sessions get 403 from the GitHub API directly.
2. If the job failed, collect each line of the form `<file>:<line> <section> <key>: the exit condition ... is met`, and each `could not be checked`.
3. For every met entry, name one owner for a single pull request that removes the entry and its patch file and passes verify. If verify still needs the deviation, the pull request replaces the condition with the next event.
4. Report an entry that could not be checked as a finding of its own.
