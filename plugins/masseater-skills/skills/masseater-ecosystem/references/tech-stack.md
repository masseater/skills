# The tech stack and where to draw the line on building things yourself

This describes masseater's whole set of tools as the "masseater ecosystem": the state of its finished form, and the boundary between what is built in-house and what is borrowed.

The finished form is where things are heading. Migrations such as consolidating into the monorepo or removing root configuration files are done when requested. Until then, follow each repository's current rules.

## The state of the finished form

### Built just by saying "I want this"

- When the user says "I want this", it is built and runs without the user's manual work. Some manual work, such as granting permissions, is acceptable
- The targets are music plugins such as VSTs, games, game mods, Discord, wikis, research on decision models, and 3D in Unity and Blender
- Do not build an OS
- Eventually it is fine to build replacements for Unity and Blender yourself. Building at that scale is acceptable
- For anything undecided, build it when it becomes necessary

### Decided choices

- The languages are TypeScript and Rust. Do not use C#, except as a closed exception for only what is needed inside Unity
- Do not use Python, without exception. Put it nowhere in code, scripts, CI, verification or dependencies, and do not write it inside Blender either. The rule is in repo-conventions
- The format of music plugins is based on VST3. Logic Pro reads only AU, so whether to ship AU is undecided
- Use only Stripe for payments. Do not build a license server for now
- The distribution targets are only npm and crates.io. Add others when they become necessary
- The 3D data formats handled are FBX, `.blend` and glTF. Add others when they become necessary
- Things for PCs run on Windows, macOS and Linux. Build resident processes when they become necessary
- Claude is used because the quality of the claude.ai service is good. Models are chosen per use, and models other than Claude are also used
- UIs are built with React and TanStack Start
- The current D1, better-auth and drizzle-orm are the standard for database, authentication and ORM
- Tests are Vitest and Playwright for TypeScript, and `cargo test` for Rust
- There are no rules yet for visual tuning
- Measurement data is kept on Cloudflare
- Domains and DNS are managed on Cloudflare. `.jp` domains, which cannot be obtained from Cloudflare, will be considered when needed
- Requests from users of what is built are basically not accepted. Whether to accept one is decided case by case

### Personal use only, welcoming vendor lock-in

- Do not seek generality. Specialize for your own use cases, and keep no branches or compatibility for other environments
- Assume dependence on Cloudflare, Claude, Vite+ and GitHub. Lock-in to SaaS is fine too
- GitHub gives free Actions for public repositories, and Claude comes with a cloud execution environment. Ride on this cheapness

### Consolidate into one public monorepo

- Consolidate almost every repository into one public monorepo
- mirucord and konomi are for self-hosting, so they remain in separate repositories
- personal-space and claude-workspace have rules requiring them to stay private, so they do not go into the public monorepo
- Divide the workspace into apps, libs, tools and infra. Things that are distributed, such as VSTs, also go in apps

### vite.config.ts is the only source of truth for configuration

- Consolidate each repository's source of truth for configuration into a single vite.config.ts
- Do not put configuration files at the root. Do not put `.gitignore` there either; generate `.git/info/exclude` from vite.config.ts. `.git/info/` is not committed, so the root can be kept empty in the same way that Vite+ sets `core.hooksPath`

### Measure everything

- Measure everything before and after each commit
- Put measured numbers where AI can look at them itself, look them up later, and use them for its next judgment

## The boundary between building and borrowing

### What to borrow: cores that follow language specifications, and well-designed APIs

- Borrow cores that follow language specifications. oxc's crates, tsgo, rustc, rust-analyzer and `cargo metadata` fall under this
- Borrow APIs others have designed well. The Cloudflare and Claude APIs, and Vite Task's cache and remote cache fall under this

Cores have fixed specifications, and are unlikely to cause dissatisfaction. Rebuilding them gains nothing and only adds maintenance.

### What to build: the surfaces developers touch, and the mechanisms that connect them

- A monorepo management tool that handles TypeScript and Rust seamlessly
- Extensions to Vite+: a Cargo provider that puts crates on the task graph, components that export runs to OTLP and Workers Logs, and generation of `.git/info/exclude` fall under this
- The surface of lint and format. Borrow oxc for the core, and build the entry points for rules and settings
- The surface of testing. Make each language's test framework runnable from one entry point

What you build may be assumed to be built in-house. For everything else, follow repo-conventions' way of choosing means, and dont-it-yourself.

The reason to build them is that OSS update flows exist because many people are affected. If you build things for yourself with AI, you can skip those procedures and fix things right away when they bother you. Dissatisfaction arises at the surfaces you touch every day and at the seams, so keep only those in your own hands.

### Only when there is no other way: modifying what you borrowed

- Modify borrowed things with forks or patches only when they have no extension points and there is no prospect of a fix upstream. Vite Task's graph can only make `package.json` a node and has no extension points, so adding only the entry point of the graph with a fork falls under this
- Limit the scope of modification to the missing parts. A fork need not stay compatible with upstream, and you take in changes selectively only when there are changes you want

### What not to build

- An OS
- Your own programming language

## How the discussion went

This is the discussion in the project chat on 2026-11-07.

1. The user said they want to build everything themselves and fix things right away when they bother them, without being bound by other people's OSS update flows. What is needed most is a monorepo management tool that handles TypeScript and Rust seamlessly, with vite.config.ts as the single source of truth for configuration, and without root configuration files or even `.gitignore`. The goal is to create a place where AI can look up all measurements itself
2. Vite+ 1.5.0 was investigated. Vite Task's cache records the process's reads and writes, so it works regardless of language, and `cargo` can be put on it too. What is missing is the graph and measurement: only `package.json` can be a node, task settings reject unknown keys, and there are no extension points. The plan for 2026 Q4, [vite-plus#3277](https://github.com/voidzero-dev/vite-plus/issues/3277), has no non-JS workspaces either. The conclusion was that, rather than building from scratch, forking Vite Task and adding only the entry point of the graph is the minimum. [moon v2](https://moonrepo.dev/blog/moon-v2.0) can put Rust and TS on the same graph, but was not adopted because its settings are split per project
3. The user welcomed vendor lock-in, and chose specializing for their own use cases over generality. With this, the fork no longer needs to stay compatible with upstream, and things can be built on the premise that the remote cache lives on their own Cloudflare and measurements are sent to Workers Logs
4. Cases of people who build everything themselves were researched. The ones that worked narrowed what they built themselves to the core of their main work. Jonathan Blow built a language and spent ten years on it to ship a game. Andreas Kling dropped SerenityOS's "everything in-house" with Ladybird and left graphics and audio to libraries. The ones that broke down either made building tools the goal in itself, or stalled in a state that only the person could keep running. TempleOS and Handmade Hero fall under this. Among cases in the AI era, Mario Zechner built his own minimal agent, pi, so as not to be jerked around by changes to Claude Code, and Armin Ronacher [runs pi to fix pi](https://lucumr.pocoo.org/2026/5/24/pi-oss/). On the other hand, Ronacher also wrote that [building has become so easy that polishing cannot keep up](https://lucumr.pocoo.org/2026/1/18/agent-psychosis/), and [Personal software factories are a waste of time](https://www.peterp.me/articles/personal-software-factories-are-a-waste-of-time/) points out the trap of continuing to build a factory with nothing to build
5. Based on the cases, the boundary was set: borrow the core, and build only the surfaces developers touch and the mechanisms that connect them. Building a language was put outside the scope
6. The user extended lock-in to SaaS as well, on the grounds that GitHub gives free Actions for public repositories and Claude comes with a cloud environment, so both are too cheap. The whole of the tools built on this premise came to be called the "masseater ecosystem"
7. The scope was elicited. C# and Python are disliked, so they were made exceptions only inside Unity and Blender, and building at a scale that replaces Unity and Blender in the future was accepted. To the question of whether VST3 would be a problem for macOS, the answer was that VST3 also works on macOS but Logic Pro reads only AU. Rust's [nih-plug](https://github.com/robbert-vdh/nih-plug) can output VST3 and CLAP, and AU needs a separate wrapper. Payments only via Stripe, distribution only to npm and crates.io, data formats FBX, `.blend` and glTF, and OSes Windows, macOS and Linux were decided, each to be extended when it falls short. It was decided to build unknown things when they become necessary
8. Next, it was decided to keep React and TanStack Start for UI, as they are easy to use and cause no trouble, to move measurement data, domains and DNS to Cloudflare, and basically not to accept requests from users. The current database, authentication and ORM became the standard, and for tests the user wanted a single entry point because using different frameworks per language is tedious. Visual tuning has no rules yet, and it seemed likely to end up being built in-house eventually
9. On 2026-11-10 the user banned Python entirely. It is put nowhere in code, scripts, CI, verification or dependencies, and the exception inside Blender was also removed. The exception for C# only inside Unity remains
