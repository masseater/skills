# 名前とファイル

原典の Redux・`.jsx`・`*Screen` は採らない。

## 識別子

| 対象 | 形式 | 例 |
| --- | --- | --- |
| コンポーネント | PascalCase | `Button`、`LoginPage`、`LoginDialog` |
| ページコンポーネント | `[Name]Page`（`Screen` 接尾辞は使わない） | `LoginPage` |
| 定数 | `SCREAMING_SNAKE` | `DEFAULT_STATE`、`MAX_PAGES_WITHOUT_GAPS` |

## ファイル

| 対象 | 形式 | 例 |
| --- | --- | --- |
| ソース | kebab-case の `.ts` / `.tsx` | `login-page.tsx`、`button.tsx` |
| テスト | `*.test.ts` / `*.test.tsx` | `filter.test.ts` |

アプリの `src/` は FSD のレイヤーだけを置く。ページは `pages/<slice>/ui/*-page.tsx`、クエリは `api` セグメント、Atom は `model` セグメントに置く。
