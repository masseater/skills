# Names and files

Do not adopt the original article's Redux, `.jsx`, or `*Screen`.

## Identifiers

| Target | Format | Examples |
| --- | --- | --- |
| Component | PascalCase | `Button`, `LoginPage`, `LoginDialog` |
| Page component | `[Name]Page` | `LoginPage` |
| Constant | `SCREAMING_SNAKE` | `DEFAULT_STATE`, `MAX_PAGES_WITHOUT_GAPS` |

## Files

| Target | Format | Examples |
| --- | --- | --- |
| Source | kebab-case `.ts` or `.tsx` | `login-page.tsx`, `button.tsx` |
| Test | `*.test.ts` or `*.test.tsx` | `filter.test.ts` |

An app's `src/` contains only FSD layers.

- Pages are `pages/<slice>/ui/*-page.tsx`
- Atoms are in the `model` segment
