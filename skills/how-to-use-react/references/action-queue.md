# 操作を止めないミューテーション

原典の `useActionState` のキューイングは、`useMutation` に `scope: { id }` を渡して作る。同じ `scope.id` のミューテーションは順番に実行される。

## やる

- 順番が仕様のミューテーション（追加のあとに確定、など）は、同じ `scope.id` に載せる。
- `useOptimistic` と `startTransition` で画面はすぐ更新する。pending は半透明などの演出に使う。

## 代わりに使わないもの

- ボタンの無効化で pending のあいだ操作列全体を止めない。ユーザーは続けて操作したいので、`useOptimistic` で受け付け続ける。
- 順番が仕様の列を、`Effect.all(..., { concurrency: "unbounded" })` や別々の scope に載せない。後の操作が先に終わり、サーバーの状態が壊れる。
- キューを `useRef` や Effect Atom で自前実装しない。`scope.id` がすでに順番を保証する。
- `useActionState` / `useFormStatus` の代わりに `useMutation` を使う。pending と error を TanStack Query に集めるためである。

一度きりの送信フォームは、`disabled={mutation.isPending}` と `aria-busy={mutation.isPending}` で二重送信を防いでよい。操作を連打させたい列だけ、上の「やる」を適用する。
