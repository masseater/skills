---
name: how-to-use-react
description: Read when writing, fixing or reviewing React 19.3 components, loaders and server processing. Decides where state lives, how to structure async work, where to use the concurrent UI APIs, and the shape of props.
metadata:
  derived-from: >-
    https://github.com/vercel-labs/agent-skills/tree/063bee94c3f4df8453406c830b0a7df0f2860278/skills/react-best-practices
    https://github.com/adhhamdev/modern-react-guidance/tree/569e90f516aa5248afef0614ece3fb9ab36087be
    https://speakerdeck.com/uhyo/react-no-sekkeiron
    https://zenn.dev/uhyo/articles/async-react-action-queue
    https://zenn.dev/uhyo/articles/async-react-debounce
    https://zenn.dev/uhyo/articles/async-react-debounce-2
    https://imply.io/blog/an-opinionated-guide-to-component-apis
    https://gist.github.com/rafaelrozon/9fd6bc9efbce3e70311b364f87b89241/a2c1ee76bd90722161dd9ffe3b17b1dddf669b72
---

# how-to-use-react

The originals have been adapted for repositories created from masseater/typescript-template. Where they conflict with the originals, the adaptation wins.

- Split state between Effect Atom and TanStack Query
- Eliminate async waterfalls
- In repositories with React Compiler, do not write `useMemo`, `useCallback` or `memo`
- Do not adopt Next.js, SWR, Redux or `better-all` from the originals

## Why this skill is needed and the state it should achieve

This skill is needed because React lets the same screen be written many ways, and every way works at first. The differences show up when data grows, communication is slow, and operations overlap, so at the time of writing you cannot notice that you chose a bad way.

The state this skill should achieve is that screens do not block or keep the user waiting, and there is no hesitation about where to put any state.

## Where things go

| What you want to do | What to use | What not to use |
| --- | --- | --- |
| Temporary screen state, form values, values shared across the tree | Effect Atom (`Atom.make`, `useAtom`, `useAtomValue`) | `useState`, `useReducer`, `createContext`, `useContext` (rejected by `no-restricted-imports`) |
| Server data | TanStack Query (`queryOptions` in FSD's `api` segment) | Fetching with `use(promise)`, combining `useEffect` and `fetch`, putting server responses in an Atom |
| Mutation pending and error | TanStack Query's `useMutation` | Homemade pending flags, `useActionState`, `useFormStatus` |
| Mutations whose order is part of the specification | `useMutation` with the same `scope.id` | A homemade queue, disabling buttons to stop the sequence of operations |
| Optimistic updates | `useOptimistic` | Homemade rollback state |
| Non-urgent updates and heavy derivations | `useTransition` / `startTransition` / `useDeferredValue` | Timer debouncing |
| ref | A function prop | `forwardRef`, string refs |
| Keeping state while hidden | `<Activity mode="hidden">` | Throwing state away with conditional unmounting |
| Transition animations | `<ViewTransition>` | |
| Using the latest props in an Effect | `useEffectEvent` | Adding that function to the dependency array and resubscribing, stashing the handler in a ref |

## Memoization

- In repositories with React Compiler enabled, do not write `useMemo`, `useCallback` or `memo`
- In repositories without the Compiler, write `useCallback` or `useMemo` only where the `react-perf` rules point
- Otherwise, add it only after measurement shows something is slow

## Async waterfalls

Also read [`async`](references/async.md). Apply this section before React's other performance topics.

- Start operations that do not use a previous result at the same time by passing `{ concurrency: "unbounded" }` to `Effect.all` or `Effect.forEach`
- If the order is part of the specification, write `{ concurrency: 1 }`. Do not omit it
- For Promises outside Effect, use `Promise.all`
- When only part depends on something, build the dependent side with `Effect.flatMap` and put it in one `Effect.all` with the independent side

```ts
const loaded = Effect.all(
  {
    config: fetchConfig,
    profile: fetchUser.pipe(Effect.flatMap((user) => fetchProfile(user.id))),
  },
  { concurrency: "unbounded" },
);
```

## Parts of the originals not adopted

| Original | Instead |
| --- | --- |
| Next.js (`next/dynamic`, `after()`, using React `cache()` across requests) | TanStack Start loaders |
| SWR | TanStack Query |
| `better-all` | `Effect.all` |
| Redux Action / Reducer / Selector | Effect Atom and TanStack Query, FSD's `model` / `api` / `ui` |

For API shapes you are unsure of, look at the relevant reference on react.dev. Do not copy examples from the originals as they are with hooks that the table above says not to use.

## References

Read all of the following too.

- [`effects-and-data`](references/effects-and-data.md). What may be written in an Effect, and where data lives
- [`design-theory`](references/design-theory.md). The premises of the design of transitions and Suspense
- [`action-queue`](references/action-queue.md). Mutations that do not block interaction
- [`deferred-consistency`](references/deferred-consistency.md). Separating heavy lists from input
- [`concurrent-ux`](references/concurrent-ux.md). `<Activity>`, `<ViewTransition>`, `useEffectEvent`
- [`component-apis`](references/component-apis.md). The shape of props
- [`naming`](references/naming.md). Names and files
