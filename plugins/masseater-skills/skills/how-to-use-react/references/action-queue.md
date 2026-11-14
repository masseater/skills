# Mutations that do not block interaction

Create mutations whose order is part of the specification by passing the same `scope: { id }` to `useMutation`. Mutations with the same `scope.id` run in order. This replaces the queuing with `useActionState` from the original article.

- Put a sequence whose order is part of the specification on the same `scope.id`
- Update the screen immediately with `useOptimistic` and `startTransition`
- Use pending for effects such as translucency

## What not to use

- Do not stop the whole sequence of operations while pending by disabling buttons. Users want to keep operating
- Do not put a sequence whose order is part of the specification on `Effect.all` with `concurrency: "unbounded"` or on separate scopes. A later operation finishes first and breaks the server state
- Do not implement a queue yourself with `useRef` or an Effect Atom. `scope.id` already guarantees the order

A one-off submit form may prevent double submission with `disabled={mutation.isPending}` and `aria-busy={mutation.isPending}`. Apply the rules above only to sequences where you want users to be able to hammer the operation.
