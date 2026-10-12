# 重い派生は一貫性を外す

大本: https://zenn.dev/uhyo/articles/async-react-debounce

入力そのものと、重い一覧・ハイライト結果の一貫性を同じレンダーに載せると、入力の反映が重い再レンダーの完了まで遅れる。タイマーデバウンス（`useRef` + `setTimeout` + 二重の state）は書かない。

- いまの入力は Effect Atom にすぐ書く。
- 一覧に渡す値は `useDeferredValue` で遅らせる。必要なら `useTransition` の pending で「遅れている」ことを示す。
- 手書きの `useDebounced*` は作らない。続編 https://zenn.dev/uhyo/articles/async-react-debounce-2 のトランジション対応の自前デバウンスも採らず、`useDeferredValue` に寄せる。
