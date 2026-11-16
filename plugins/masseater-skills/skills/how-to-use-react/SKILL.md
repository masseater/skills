---
name: how-to-use-react
description: React 19.3のコンポーネント、ローダー、およびサーバー処理の記述、修正、レビュー時に参照する。ステートの配置場所、非同期処理の構成方法、並行UI APIの使用箇所、およびpropsの形式を決定する。
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

原文は masseater/typescript-template から作成されたリポジトリ向けに改変されている。原文と矛盾する箇所については、改変版が優先される。

- Effect AtomとTanStack Query間でステートを分割
- 非同期ウォーターフォールを排除
- React Compiler を使用するリポジトリでは、`useMemo`、`useCallback`、`memo` を記述しないこと。
- 原文から Next.js、SWR、Redux、または `better-all` を採用しないこと。

## なぜこのスキルが必要なのか、および実現すべき状態

React では同一の画面を多様な方法で記述でき、どの方法も最初は動作するため、このスキルが必要となる。データが増加し、通信が遅くなり、操作が重複すると差異が現れるため、記述時点では誤った方法を選んだことに気づかない。

このスキルで実現すべき状態は、画面がブロックしたりユーザーを待たせたりせず、またどこにステートを配置すべきか迷うことがない状態である。

## 配置先

| やりたいこと | 使用するもの | 使用しないもの |
| --- | --- | --- |
| 一時的な画面状態、フォーム値、ツリー全体で共有される値 | Effect Atom (`Atom.make`, `useAtom`, `useAtomValue`) | `useState`, `useReducer`, `createContext`, `useContext` (msch の lint ルール `msch-lint/ui-state-in-atoms` が拒否) |
| サーバーデータ | TanStack Query (FSDの `api` セグメント内の `queryOptions`) | `use(promise)` によるフェッチ、`useEffect` と `fetch` の組み合わせ、サーバーレスポンスをAtomに格納する |
| Mutation pending およびエラー | TanStack Query の `useMutation` | 自作の保留フラグ、`useActionState`、`useFormStatus` |
| 順序が仕様の一部であるミューテーション | 同一の `scope.id` を持つ `useMutation` | 自作のキュー、操作シーケンスを停止させるボタンの無効化 |
| 楽観的更新 | `useOptimistic` | 自作のロールバック状態 |
| 非緊急の更新および重い導出 | `useTransition` / `startTransition` / `useDeferredValue` | タイマーのデバウンス |
| ref | 関数のプロップ | `forwardRef`、文字列参照 |
| 状態を非表示にしたまま保持すること | `<Activity mode="hidden">` | 条件付きアンマウントで状態を破棄すること |
| トランジションアニメーション | `<ViewTransition>` | |
| Effect で最新のプロップを使用すること | `useEffectEvent` | その関数を依存配列に追加して再サブスクライブし、ハンドラを参照に格納すること |

## メモ化

- React Compiler が有効なリポジトリでは、`useMemo`、`useCallback`、`memo` を記述しないこと
- Compiler が無効なリポジトリでは、`react-perf` ルールが指す箇所にのみ `useCallback` または `useMemo` を記述すること
- それ以外の場合は、計測結果が遅いことが示された後にのみ追加すること

## 非同期ウォーターフォール

また、[`async`](references/async.md) も参照すること。React の他のパフォーマンストピックよりも先にこのセクションを適用すること。

- `Effect.all` または `Effect.forEach` に `{ concurrency: "unbounded" }` を渡すことで、直前の結果を使用しない操作を同時に開始すること。
- 順序が仕様の一部である場合は、`{ concurrency: 1 }` と記述すること。省略しないこと。
- Effect 外の Promise には `Promise.all` を使用すること。
- Promise が何らかの要素にのみ依存している場合は、依存側を `Effect.flatMap` でビルドし、独立した側と共に一つの `Effect.all` に配置すること。

```ts
const loaded = Effect.all(
  {
    config: fetchConfig,
    profile: fetchUser.pipe(Effect.flatMap((user) => fetchProfile(user.id))),
  },
  { concurrency: "unbounded" },
);
```

## 元の要素の一部が採用されていない場合

| 元の | 代わりに |
| --- | --- |
| Next.js (`next/dynamic`、`after()`、リクエストをまたいだ React の `cache()` の使用) | TanStack Start のローダー |
| SWR | TanStack Query |
| `better-all` | `Effect.all` |
| Redux Action / Reducer / Selector | Effect Atom と TanStack Query、FSD の `model` / `api` / `ui` |

判断に迷う API シェイプについては、react.dev の関連リファレンスを参照すること。上記の表で使用しないよう指定されているフックがあるため、元のサンプルをコピーしないこと。

## 参考文献

以下もすべて読んでください。

- [`effects-and-data`](references/effects-and-data.md)。Effect で記述できる内容と、データが配置される場所
- [`design-theory`](references/design-theory.md)。遷移と Suspense の設計に関する前提
- [`action-queue`](references/action-queue.md)。インタラクションをブロックしないミューテーション
- [`deferred-consistency`](references/deferred-consistency.md)。重いリストと入力を分離すること
- [`concurrent-ux`](references/concurrent-ux.md). `<Activity>`, `<ViewTransition>`, `useEffectEvent`
- [`component-apis`](references/component-apis.md). The shape of props
- [`naming`](references/naming.md)。名前とファイル
