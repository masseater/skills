# 重い派生は一貫性を外す

入力と重い一覧を同じレンダーに載せると、入力の反映が一覧の再レンダーまで遅れる。タイマーデバウンス（`useRef` + `setTimeout` + 二重の state）ではなく、次の形で入力と一覧を分ける。

- いまの入力は Effect Atom にすぐ書く。
- 一覧に渡す値は `useDeferredValue` で遅らせる。必要なら `useTransition` の pending で「遅れている」ことを示す。
- 手書きの `useDebounced*` や、続編（`async-react-debounce-2`）のトランジション対応の自前デバウンスの代わりに、`useDeferredValue` を使う。
