# 並行UI

設計の前提については [`design-theory`](design-theory.md) も参照。

- 遷移の入退室を `<ViewTransition>` に記述する。
- `<Activity>` との往復で状態が保持されるべき遷移の画面を非表示にする。
- すべてのサブスクリプションで最新である必要のない値を `useEffectEvent` に移動する。

## ViewTransition

そのライドの入退室を遷移で囲む。Suspense で `<ViewTransition>` 内の更新を明示し、遅延表示する。`startTransition` 内で状態を変更する。

## Activity

タブ、サイドバー、および往復で入力が保持されるべき画面を `<Activity mode={open ? "visible" : "hidden"}>` で切り替える。`hidden` 状態のとき、エフェクトは取り除かれる。

## useEffectEvent

エフェクトが依存配列で引き受けるものを保持する。すべてのサブスクリプションで最新である必要のない値を `useEffectEvent` に移動する。その関数を依存配列に記述しない。レンダリングごとにその実体が変わるため、エフェクトはレンダリングごとに再実行される。
