# 非同期の瀑布を消す

大本: https://github.com/vercel-labs/agent-skills/tree/main/skills/react-best-practices の `async-*` 規則（`rules/async-parallel.md`、`async-defer-await.md`、`async-cheap-condition-before-await.md`、`async-dependencies.md`、`async-api-routes.md`、`async-suspense-boundaries.md`）。

## 独立した処理は同時に始める

前の結果を使わない処理を、順番に `yield*` したり `await` したりしない。Effect では `Effect.all` か `Effect.forEach` に `{ concurrency: "unbounded" }` を渡す。順番が仕様なら `{ concurrency: 1 }` と書く。

## 使う枝に入ってから待つ

結果を使わない枝があるなら、その枝に入ってから待つ。入る前に待つと、すぐ戻るパスでも I/O が終わるまで止まる。

## 安い条件を先に見る

`flag && localCondition` のように、ネットワークや DB の結果と、既に手元にある条件の両方が要るときは、手元の条件を先に見る。手元の条件が偽なら flag も I/O も始めない。手元の条件が flag の結果に依存するとき、条件の方が重いとき、副作用の順番が仕様のときは、元の順番を保つ。

## 一部だけ依存するとき

`user` が終わってから `profile` を取る必要があるときでも、`config` は `user` を待たせない。依存しない Effect と、依存する Effect を `Effect.flatMap` で組んだものを、一つの `Effect.all(..., { concurrency: "unbounded" })` に入れる。

## API とサーバー処理

セッションが要らない読み取りを、認証の後ろに並べない。セッションが要らない Effect は認証と同時に始め、セッションが要る Effect は認証の結果を `Effect.flatMap` で受け取ってから始める。両方を `Effect.all(..., { concurrency: "unbounded" })` に載せる。Elysia のルートも TanStack Start のサーバー関数も同じである。

## 殻をデータの完了まで止めない

ナビ、ヘッダー、フッターは、本体のデータが終わるまで描画を止めない。データが要る部分だけ `<Suspense>` の内側に置く。レイアウトの分岐に必須な値だけ、殻の外で待つ。小さなクエリで Suspense の切り替わりの方が目立つときは、殻と一緒に待ってよい。
