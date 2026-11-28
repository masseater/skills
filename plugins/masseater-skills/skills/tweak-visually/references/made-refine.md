# made-refine

ブラウザ上で要素を選び、余白・角丸・影・色・文字を動かす React 用の編集画面。ソースには触らない。動かした結果を、コンポーネント名・セレクタ・周辺の HTML・CSS の変更を添えた文章としてコピーする。

## 導入

`npx made-refine@latest init` は対話式で、Vite の設定に Vite プラグイン `madeRefine()` と Babel の設定を足す。Vite 8 と `@vitejs/plugin-react` 6 のアプリでは、`madeRefine()` が先に読み込むスクリプトが原因で、ページが白紙になる（`@vitejs/plugin-react can't detect preamble`）。また plugin-react 6 は `babel` オプションを受け付けない。

そのため `init` を使わず、次の 2 つだけを足す。

```tsx
import { DirectEdit } from "made-refine";

{import.meta.env.DEV && <DirectEdit />}
```

`vite.config.ts` は変えない。この構成で、編集画面が開き、要素を選んで値を動かし、コピーできることを確かめてある。

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

冒頭には、既存のスタイルの書き方に合わせて反映するよう求める指示が付く。

## 版

- 安定版 `0.3.0`（2026-06-22）。確かめたのはこの版である。
- `0.4.0-beta.1`（2026-09-10）は、padding のハンドルや整列スナップが入る。確かめていない。
- 差分を Claude に直接送る機能は、組み込み先のアプリが用意する通信路を前提にしており、そのままでは使えない。貼り付けで受け取る。

ライセンスは FSL-1.1-MIT である。
