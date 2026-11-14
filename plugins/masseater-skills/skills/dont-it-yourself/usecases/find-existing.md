# Finding what already exists

1. Search in this order: Effect's modules, dependencies already in the repository, masseater's own packages, npm. You can list masseater's own packages with `vp pm search maintainer:r_masseater`, and read a README at `https://unpkg.com/<name>/README.md`
2. Run `vp exec intent list` at the repository root, and if a skill bundled with an installed dependency fits, read it with `vp exec intent load <package>#<skill>`
3. For processing that handles a standard or a widely used format, search npm on the assumption that a library exists. Look it up by the name and number of a standard such as RFC, W3C, ECMA or ISO, the name of the format, and the name of the data it handles
4. When you find a candidate, look directly at the list of packages in the repository's `packages/` or in the npm scope, and confirm what is available
5. If there are several candidates, choose one that is still maintained, has type definitions and has few dependencies

A summary of search results sometimes lists only some of the packages. If you decide the scope from the summary, you will judge something available to be missing and build it yourself. That is why step 4 looks at the list directly.
