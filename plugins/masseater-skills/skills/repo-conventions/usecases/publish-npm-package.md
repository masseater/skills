# Publishing a package to npm

1. Remove `private` from the package and give it `publishConfig`. `publish.yml` selects what to publish by these two
2. `publish.yml` publishes with Trusted Publisher (GitHub OIDC) and `--provenance`. On the npm side, register `publish.yml` and the environment `npm`. Do not keep a token
3. If you use release-please, set the `if` of the `release` job in `verify.yml` to your repository name, and also bump the version in the package's `package.json` with `extra-files`. When a release is cut, `publish.yml` is called
4. Write `publint: { strict: true }` and `attw: { profile: "esm-only", level: "error" }` in the `vp pack` settings, and add `publint` and `@arethetypeswrong/core` to devDependencies. fallow cannot trace the use of these two, so list them in `ignoreDependencies` in `.fallowrc.jsonc`
5. Measure the bundle size with size-limit (`@size-limit/file`). Put `"size": "vp run build && size-limit"` and the `size-limit` settings in the package, add `"size-all": "vp run -r size"` to the root `vite.config.ts`, and put it in the `dependsOn` of verify. `vp run -r` fails if there is not a single target task
6. Write `limit` as exactly the current size in bytes. When increasing it, raise `limit` and write the reason in the commit message
7. Add one line on when to use the published package to "masseater's own packages" in dont-it-yourself. Own packages get buried in npm search, which orders by popularity, so anything not listed there goes unnoticed by AI working in other repositories
