# 並行 UI

設計の前提は `design-theory.md`。

## ViewTransition

遷移、Suspense の表示、deferred 更新に乗る出入りは `<ViewTransition>`。`startTransition` の中で状態を変える。

## Activity

タブ、サイドバー、行き来しても入力を残したい画面は `<Activity mode={open ? "visible" : "hidden"}>`。`hidden` のあいだ Effect は破棄される。

## useEffectEvent

Effect が購読する対象は依存配列に残し、購読のたびに最新でなくてよい値は `useEffectEvent` に移す。その関数は依存配列に入れない。同一性がレンダーごとに変わり、Effect が毎レンダー実行し直すためである。
