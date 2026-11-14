# dependencies

Confirm where what you use comes from, its terms of use, and the version of the runtime environment. The build passes even if a license or terms of use are violated, and even on an old Node.js.

| Item to check | How to check the current state | Condition for being satisfied |
| --- | --- | --- |
| Choice of dependency packages | Among the processing you built yourself, look for what can be replaced by an existing library | It follows dont-it-yourself |
| Licenses of dependency packages | List the licenses of the dependency packages with a tool that outputs a license list | They do not contradict the form of distribution |
| Third-party materials | Check the origin and terms of use of images, audio and text | Only materials whose publication is permitted are in public repositories and publishing destinations |
| Node.js version | Check `.node-version`, `mise.toml`, `setup-node` and `setup-vp` in CI, `FROM` in the Dockerfile, and `engines.node` in `package.json`. For packages published to npm and the like, also check `engines.node` in their `package.json` and the requirements in the README | Node.js in development, CI and production is 26 or later. Published packages have `engines.node` set to `>=26`, and the README also lists only 26 or later as a requirement |
