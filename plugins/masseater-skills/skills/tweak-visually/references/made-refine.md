# made-refine

ブラウザ上で要素を選び、余白・角丸・影・色・文字を動かす React 用の編集画面。ソースには触らない。動かした結果を、コンポーネント名・セレクタ・周辺の HTML・CSS の変更を添えた文章としてコピーする。

## 導入

`npx made-refine@latest init` は対話式で、Vite の設定に Vite プラグイン `madeRefine()` と Babel の設定を足す。Vite 8 と `@vitejs/plugin-react` 6 のアプリでは、`madeRefine()` が先に読み込むスクリプトが原因で、ページが白紙になる（`@vitejs/plugin-react can't detect preamble`）。また plugin-react 6 は `babel` オプションを受け付けない。

そのため `init` を使わず、`App` に次の 1 行を足すだけにする。`vite.config.ts` の made-refine 向けの変更は要らない。

```tsx
import { DirectEdit } from "made-refine";

<DirectEdit />
```

## アーティファクトとして公開する

- アーティファクトは、スクリプト・スタイル・画像をページに埋め込み、外部への通信を禁じる。ビルドは `vite-plugin-singlefile` で 1 つの HTML にする。
- `minify: false` にする。縮めると、コピーに入るコンポーネント名が `z6` のようになる。
- 本番ビルドでは `source` が `(file not available)` になる。要素は `selector` と `context` で探す。
- 持ち主の PC や claude.ai のサインインは使えないため、確かめはクラウドで行う。Artifact ツールの `read` で公開済みの HTML を取り出し、アーティファクトと同じ制限（サンドボックスの iframe、スクリプトとスタイルはインラインのみ、通信なし）を再現した Chromium で開く。編集画面が開き、角丸を動かしてコピーでき、クリップボードに差分が入ることを、この方法で確かめた。

## 使い方

- `Ctrl + .`（Mac は `Cmd + .`）で編集画面を開閉する。要素をクリックすると、右のパネルに Layout・Radius・Fill・Border・Shadow が並ぶ。
- 右下のコピーボタンで、次の形の文章がクリップボードに入る。

```text
@<App>
react: App
source: /[project]/src/App.tsx:81:21
path: #center > button.counter
target:
<button class="counter">…</button>
context:
<section id="center">…</section>
edits:
border-radius: 42px (rounded-[42px])
```

冒頭には、既存のスタイルの書き方に合わせて反映するよう求める指示が付く。開発サーバーで動かしたときの `source` の行番号は実ファイルとずれた（25 行目付近が 81 行目と出た）ので、探す手がかりにだけ使う。

## 版

- 安定版 `0.3.0`（2026-06-22）。確かめたのはこの版である。
- `0.4.0-beta.1`（2026-09-10）は、padding のハンドルや整列スナップが入る。確かめていない。
- 差分を Claude に直接送る機能は、組み込み先のアプリが用意する通信路を前提にしており、そのままでは使えない。貼り付けで受け取る。

ライセンスは FSL-1.1-MIT である。
