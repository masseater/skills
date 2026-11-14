# 名称とファイル

元記事の Redux、`.jsx`、`*Screen` を採用しないでください。

## 識別子

| 対象 | 形式 | 例 |
| --- | --- | --- |
| コンポーネント | PascalCase | `Button`, `LoginPage`, `LoginDialog` |
| ページコンポーネント | `[Name]Page` | `LoginPage` |
| 定数 | `SCREAMING_SNAKE` | `DEFAULT_STATE`, `MAX_PAGES_WITHOUT_GAPS` |

## ファイル

| 対象 | 形式 | 例 |
| --- | --- | --- |
| 例 | kebab-case `.ts` または `.tsx` | `login-page.tsx`, `button.tsx` |
| テスト | `*.test.ts` または `*.test.tsx` | `filter.test.ts` |

アプリの `src/` には FSD レイヤーのみが含まれています。

- ページは `pages/<slice>/ui/*-page.tsx` です。
- Atom は `model` セグメントにあります。
