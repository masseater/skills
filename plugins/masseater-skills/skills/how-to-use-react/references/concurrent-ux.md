# Concurrent UI

Also read [`design-theory`](design-theory.md) for the premises of the design.

- Put the entering and leaving of transitions on `<ViewTransition>`
- Hide screens whose state should survive going back and forth with `<Activity>`
- Move values that do not need to be the latest on every subscription into `useEffectEvent`

## ViewTransition

Wrap entering and leaving that ride on transitions, Suspense reveals and deferred updates in `<ViewTransition>`. Change state inside `startTransition`.

## Activity

Switch tabs, sidebars and screens whose input should survive going back and forth with `<Activity mode={open ? "visible" : "hidden"}>`. While `hidden`, Effects are torn down.

## useEffectEvent

Keep what an Effect subscribes to in the dependency array. Move values that do not need to be the latest on every subscription into `useEffectEvent`. Do not put that function in the dependency array. Its identity changes on every render, so the Effect would re-run on every render.
