# コンポーネントAPI

- `onXxxChange` 形式の名前イベント
- ブール型のpropsの先頭に `is` を付けず、省略した場合は false とする
- 視覚的な分岐を `variant` と `size` に限定する
- コンテンツを `children` で渡し、クラスターで合成する
- インタラクティブな値をデフォルトで制御付きpropsとする

## イベント

| 使用 | 使用しない |
| --- | --- |
| `onChange`, `onOpenChange`, `onValueChange`, `onCheckedChange`, `onConfirm` | `setFoo`, `handleClick`, `changeOpen`, `onScrollTable` |

使用しない

## ブール値および複数値

| 使用 | 使用しない |
| --- | --- |
| `open`, `disabled`, `checked`, `required`, `readOnly` | `isOpen`, `isLoading`, `hasMultiple` |
| `variant` と `size` に文字列ユニオンを使用する | 見た目のためのブール値の乱立、enum のインポート |

視覚的な分岐を `variant` と `cva` の `size` に限定する。振る舞いの分岐が増えた場合はブール値を追加せず、コンポーネントを分割するかクラスターで合成する。

## 合成

- コンテンツを `children` で渡す。`children` を関数やオブジェクトにしない
- ダイアログ、メニュー、テーブルを shadcn/ui と同じクラスターで構築し、`DropdownMenuTrigger`、`DropdownMenuContent`、`DropdownMenuItem` を用いて `DropdownMenu` の形式で作成する。
- `header={...}` や `footer={...}`、`renderHeader` などのスロットpropsを公開しない。

## 見た目のオーバーライド

呼び出し箇所で色、半径、シャドウをオーバーライドしない。`@shadcn/lint` の `no-restyle` で停止する。レイアウトと間隔のみが許可される。新しい見た目が必要な場合は、コンポーネント側で `variant` を追加する。

## 制御

インタラクティブな値をデフォルトで制御付きpropsとする。`value` と `onValueChange`、`checked` と `onCheckedChange`、`open` と `onOpenChange` のペア。一時的な値用のコンテナは、コンポーネント内ではなく呼び出し元の Effect Atom 内に保持する。

文言が固定された確認ダイアログなど、コンテンツが固定されているものに限り、`title`、`description`、`confirmLabel` などの文字列propsは問題ない。
