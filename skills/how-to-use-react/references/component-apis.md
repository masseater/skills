# コンポーネントの API

大本: https://imply.io/blog/an-opinionated-guide-to-component-apis

## イベント

| 使う | 使わない |
| --- | --- |
| `onChange`、`onOpenChange`、`onValueChange`、`onCheckedChange`、`onConfirm` | `setFoo`、`handleClick`、`changeOpen`、`onScrollTable` |

値を親へ返すときは、いまの値を先に渡し、必要なら DOM イベントを最後の引数に足す。親の Effect Atom の更新方法をコンポーネントに漏らさない。

## 真偽と多値

| 使う | 使わない |
| --- | --- |
| `open`、`disabled`、`checked`、`required`、`readOnly`（省略時は偽） | `isOpen`、`isLoading`、`hasMultiple` |
| `variant` / `size` などの文字列ユニオン | 見た目用の boolean の増殖、enum の import |

見た目の分岐は `cva` の `variant` / `size` に閉じる。振る舞いの分岐が増えたら boolean を足さず、コンポーネントを分けるかクラスタで合成する。

## 合成

- 中身は `children`。`children` を関数やオブジェクトにしない。
- ダイアログ・メニュー・テーブルは shadcn/ui と同じく `DropdownMenu` + `DropdownMenuTrigger` / `DropdownMenuContent` / `DropdownMenuItem` のようなクラスタで組む。`header={...}` / `footer={...}` のスロット props や `renderHeader` は公開しない。

## 見た目の上書き

呼び出し側で色・半径・影を上書きしない。`@shadcn/lint` の `no-restyle` が止める（layout と spacing だけ許す）。新しい見た目が要るときはコンポーネント側に `variant` を足す。

## 制御

対話する値は制御 props を既定にする（`value` + `onValueChange`、`checked` + `onCheckedChange`、`open` + `onOpenChange`）。一時値の入れ物は呼び出し側の Effect Atom に置き、コンポーネントの中に持たない。

固定文言の確認ダイアログのように内容が決まったものだけ、文字列 props（`title` / `description` / `confirmLabel`）でよい。
