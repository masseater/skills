# 操作を止めないミューテーション

大本: https://zenn.dev/uhyo/articles/async-react-action-queue

原典は `useActionState` のキューイングで、同じ操作列を並行実行せず順番に処理し、そのあいだもユーザーの次の操作を受け付ける UX を示している。ここでは同じ並びを TanStack Query の `useMutation` に `scope: { id }` を渡して作る。同じ `scope.id` のミューテーションは順番に実行される。

## やる

- 順番が仕様のミューテーション（追加のあとに確定、など）は、同じ `scope.id` に載せる。
- `useOptimistic` と `startTransition` で画面はすぐ更新する。pending は半透明などの演出に使い、追加ボタンを無効にしない。

## やらない

- pending だからといって操作列全体をボタンの無効化で止める。
- 順番が仕様なのに `Effect.all(..., { concurrency: "unbounded" })` や別々の scope で並行に飛ばす。
- キューを `useRef` や Effect Atom で自前実装する。
- `useActionState` / `useFormStatus` を使う。

一度きりの送信フォームは、`disabled={mutation.isPending}` と `aria-busy={mutation.isPending}` で二重送信を防いでよい。操作を連打させたい列だけ、上の「やる」を適用する。
