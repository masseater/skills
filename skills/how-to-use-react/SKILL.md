---
name: how-to-use-react
description: React 19.3 のコンポーネント、ローダー、サーバー処理を書く・直す・レビューするときに読む。非同期の瀑布を消し、状態を Effect Atom と TanStack Query に置き分け、Effect・トランジション・Suspense・Activity・ViewTransition・useEffectEvent の使いどころとコンポーネントの props の形を決める。
license: MIT
metadata:
  upstream:
    - https://github.com/vercel-labs/agent-skills/tree/main/skills/react-best-practices
    - https://github.com/adhhamdev/modern-react-guidance
    - https://speakerdeck.com/uhyo/react-no-sekkeiron
    - https://zenn.dev/uhyo/articles/async-react-action-queue
    - https://zenn.dev/uhyo/articles/async-react-debounce
    - https://imply.io/blog/an-opinionated-guide-to-component-apis
    - https://gist.github.com/rafaelrozon/9fd6bc9efbce3e70311b364f87b89241
---

# React の使い方

大本は次の資料で、masseater/typescript-template から作ったリポジトリ向けに読み替えてある。読み替えと原典が食い違うときは読み替えを採る。

- 非同期と性能: https://github.com/vercel-labs/agent-skills/tree/main/skills/react-best-practices （MIT）
- React 19 の書き方: https://github.com/adhhamdev/modern-react-guidance （MIT、`LICENSE-modern-react-guidance`）
- 宣言的 UI とトランジション: https://speakerdeck.com/uhyo/react-no-sekkeiron
- 操作を止めないミューテーション: https://zenn.dev/uhyo/articles/async-react-action-queue
- 重い派生の一貫性: https://zenn.dev/uhyo/articles/async-react-debounce
- コンポーネント API: https://imply.io/blog/an-opinionated-guide-to-component-apis
- 名前とファイル: https://gist.github.com/rafaelrozon/9fd6bc9efbce3e70311b364f87b89241

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

1. 派生値はレンダー中に計算する。Effect で props を state にコピーしない。
2. Effect は React の外（DOM、計測、購読、ウィジェット）と同期するときだけ書き、後始末を返す（`references/effects-and-data.md`）。
3. イベントで起きる画面の変化はトランジションが既定である（`references/design-theory.md`）。
4. 操作列を止めないミューテーションは `useOptimistic` と組み合わせ、追加の操作を pending で無効にしない（`references/action-queue.md`）。
5. 重い一覧は入力と `useDeferredValue` を分け、タイマーデバウンスを書かない（`references/deferred-consistency.md`）。
6. `<Activity>`、`<ViewTransition>`、`useEffectEvent` の使いどころは `references/concurrent-ux.md`。
7. props の形は `references/component-apis.md`、名前とファイルは `references/naming.md`。

## 非同期の瀑布

独立した処理を、前の結果を使わないのに順番に待たない。React の他の性能の話より先に、この節を当てる。詳細は `references/async.md`。

- Effect なら `Effect.all` か `Effect.forEach` に `{ concurrency: "unbounded" }` を渡す。順番が仕様なら `{ concurrency: 1 }` と書く。省略しない。
- Effect の外の Promise なら `Promise.all`。
- 依存が一部だけのときは、依存しない側を先に始め、依存する側は `Effect.flatMap` で必要な値ができてから始める。両方を一つの `Effect.all` に載せる。

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
