# Check repeated corrections

Find violations that no static check catches, so the owner never has to make the same correction twice.

1. Read all of main in every repository, not only recent changes, following the repeated-corrections sweep that the hub points to. Look for documentation that restates what the code says, inline scripts that should be Vite+ tasks, workflow jobs repeated with different parameters or existing for one workspace, and exceptions that no longer do anything (disabled rules, ignore patterns, allowlist words, overrides, suppression directives, `cache: false`).
2. For each exception, determine whether removing it changes any check result. For `cache: false`, run the task twice and see whether the second run hits the cache and restores the same output.
3. For anything a deterministic check could have found, ask for a check with tests in the msch package of masseater.dev, so the next occurrence is caught mechanically. A correction found twice is a missing check.
