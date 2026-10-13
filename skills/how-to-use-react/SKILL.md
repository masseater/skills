---
name: how-to-use-react
description: React 19.3 のコンポーネント、ローダー、サーバー処理を書く・直す・レビューするときに読む。非同期の瀑布を消し、状態を Effect Atom と TanStack Query に置き分け、Effect・トランジション・Suspense・Activity・ViewTransition・useEffectEvent の使いどころとコンポーネントの props の形を決める。
license: MIT（vercel-labs/agent-skills と adhhamdev/modern-react-guidance。後者の全文は LICENSE-modern-react-guidance）
metadata:
  upstream: >-
    https://github.com/vercel-labs/agent-skills/tree/063bee94c3f4df8453406c830b0a7df0f2860278/skills/react-best-practices
    https://github.com/adhhamdev/modern-react-guidance/tree/569e90f516aa5248afef0614ece3fb9ab36087be
    https://speakerdeck.com/uhyo/react-no-sekkeiron
    https://zenn.dev/uhyo/articles/async-react-action-queue
    https://zenn.dev/uhyo/articles/async-react-debounce
    https://zenn.dev/uhyo/articles/async-react-debounce-2
    https://imply.io/blog/an-opinionated-guide-to-component-apis
    https://gist.github.com/rafaelrozon/9fd6bc9efbce3e70311b364f87b89241/a2c1ee76bd90722161dd9ffe3b17b1dddf669b72
---

# React の使い方

masseater/typescript-template から作ったリポジトリ向けに、`metadata.upstream` の資料を読み替えてある。読み替えと原典が食い違うときは読み替えを採る。

## 置き分け

| やりたいこと | 使うもの | 使わないもの |
| --- | --- | --- |
| 画面の一時状態、フォームの値、ツリーをまたいで共有する値 | Effect Atom（`Atom.make`、`useAtom`、`useAtomValue`） | `useState`、`useReducer`、`createContext`、`useContext`（`no-restricted-imports` が拒否する） |
| サーバーデータ | TanStack Query（`queryOptions` は FSD の `api` セグメント） | `use(promise)` での取得、`useEffect` と `fetch` の組み合わせ、Atom にサーバー応答を載せる |
| ミューテーションの pending と error | TanStack Query の `useMutation` | 自前の pending フラグ、`useActionState`、`useFormStatus` |
| 順番が仕様のミューテーション | 同じ `scope.id` を持つ `useMutation` | 自前のキュー、ボタンを無効にして操作列を止める |
| 楽観更新 | `useOptimistic` | 自前の巻き戻し状態 |
| 急がない更新・重い派生 | `useTransition` / `startTransition` / `useDeferredValue` | タイマーデバウンス |
| ref | 関数の props | `forwardRef`、文字列 ref |
| 隠しても状態を残す | `<Activity mode="hidden">` | 条件付きアンマウントで状態を捨てる |
| 遷移のアニメーション | `<ViewTransition>` | |
| Effect で最新の props を使う | `useEffectEvent`。依存配列には入れない | その関数を依存配列に足して購読をやり直す |

## メモ化

React Compiler が有効なリポジトリでは `useMemo`、`useCallback`、`memo` を書かない。
Compiler が無いリポジトリでは、`react-perf` のルールが props に渡す関数やオブジェクトの作り直しを指摘した箇所にだけ `useCallback` / `useMemo` を書く。それ以外は計測で遅いと分かってから足す。

## コンポーネントを書くとき

該当するものを読む。

- Effect とデータ取得: `references/effects-and-data.md`
- トランジションと Suspense: `references/design-theory.md`
- 操作を止めないミューテーション: `references/action-queue.md`
- 重い一覧と入力: `references/deferred-consistency.md`
- `<Activity>`、`<ViewTransition>`、`useEffectEvent`: `references/concurrent-ux.md`
- props の形: `references/component-apis.md`
- 名前とファイル: `references/naming.md`

## 非同期の瀑布

React の他の性能の話より先に、この節を当てる。詳細は `references/async.md`。

- 前の結果を使わない処理は、`Effect.all` か `Effect.forEach` に `{ concurrency: "unbounded" }` を渡して同時に始める。順番が仕様なら `{ concurrency: 1 }` と書く。省略しない。
- Effect の外の Promise なら `Promise.all`。
- 一部だけ依存するときは、依存する側を `Effect.flatMap` で組み、依存しない側と一つの `Effect.all` に載せる。

```ts
const loaded = Effect.all(
  {
    config: fetchConfig,
    profile: fetchUser.pipe(Effect.flatMap((user) => fetchProfile(user.id))),
  },
  { concurrency: "unbounded" },
);
```

## 採らない原典の箇所

| 原典 | 代わり |
| --- | --- |
| Next.js（`next/dynamic`、`after()`、React `cache()` をリクエストをまたいで使う） | TanStack Start のローダー |
| SWR | TanStack Query |
| `useState` / `useRef` でローディングや一時値を持つ | `useMutation`、`useTransition`、Effect Atom |
| `better-all` | `Effect.all` |
| ハンドラを ref にしまう | `useEffectEvent` |
| Redux の Action / Reducer / Selector | Effect Atom と TanStack Query、FSD の `model` / `api` / `ui` |

不確かな API の形は react.dev の該当リファレンスを見る。原典の例を、上の表が使わないとしたフックのまま写さない。
