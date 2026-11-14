# Drop consistency for heavy derivations

When the input and a heavy list share the same render, the input does not update until the list has re-rendered. Separate the input from the list.

- Write the current input to an Effect Atom immediately
- Delay the value passed to the list with `useDeferredValue`
- If you show that it is lagging, use the pending state of `useTransition`

Do not use timer debouncing. Replace with `useDeferredValue` anything built from `useRef`, `setTimeout` and duplicated state, any hand-written `useDebounced*`, and the transition-aware homemade debounce from the sequel to the original article.
