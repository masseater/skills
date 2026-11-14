# Declarative UI and transitions

React guarantees consistency and immediacy. When you relax them, declare the relaxation with an API.

- Consistency means that the UI before and after a change never appear together
- Immediacy means that a state update reaches the screen with top priority
- Only updates that align React's state with an external change that has already happened are made urgent

| Relaxation | API | When to use |
| --- | --- | --- |
| Immediacy | `useTransition` and `startTransition` | Almost every screen change caused by an event |
| Consistency | `useDeferredValue` | When the input and a heavy list need not be in the same commit |

## Suspense

A boundary is a constraint of independence: whether things must appear together or may appear separately. Rather than falling back to a skeleton by re-suspending, keep the old screen with a transition.

## Inside a transition

- Show what you want to display immediately during a transition with `useOptimistic`. Also use it for pending effects
- Put a sequence of updates whose order is part of the specification on `useMutation` with the same `scope.id`, and do not block interaction. Also read [`action-queue`](action-queue.md)

`isPending` means the transition started by that operation is in progress. Even after `await` finishes, the transition continues as long as a suspension remains.
