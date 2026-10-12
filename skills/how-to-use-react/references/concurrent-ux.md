# 並行 UI

大本: https://github.com/adhhamdev/modern-react-guidance/blob/main/references/concurrent-ux.md

設計の前提は `design-theory.md`。

## ViewTransition

遷移、Suspense の表示、deferred 更新に乗る出入りは `<ViewTransition>`。`startTransition` の中で状態を変える。状態の入れ物は Effect Atom である。

## Activity

タブ、サイドバー、行き来しても入力を残したい画面は `<Activity mode={open ? "visible" : "hidden"}>`。`hidden` は Effect を破棄し更新の優先度を下げるが、state と DOM は残す。条件でアンマウントして state を捨てる代わりに使う。開閉の状態は Effect Atom に置く。

## useEffectEvent

Effect が購読する対象は依存配列に残し、購読のたびに最新でなくてよい値は `useEffectEvent` に移す。その関数の同一性はレンダーごとに変わるので、依存配列に入れると Effect が毎レンダー実行し直す。

## deferred と transition

入力を止めずに遅れさせてよい派生（検索結果、フィルタ）は `useDeferredValue`（一貫性の緩和）。急がない更新は `useTransition`（即時性の緩和）。イベントで起きる画面の変化はトランジションが既定である。
