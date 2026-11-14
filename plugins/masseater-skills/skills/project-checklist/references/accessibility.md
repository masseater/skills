# accessibility

Confirm that the product can be used with assistive technology and the keyboard. Developers who operate with a mouse and a screen cannot see that some people are unable to use it. Follow AA of [WCAG 2.2](https://www.w3.org/TR/WCAG22/) as the standard.

| Item to check | How to check the current state | Condition for being satisfied |
| --- | --- | --- |
| Violations found by automated checks | Run Lighthouse's accessibility audit or axe on each production page | There are no violations |
| Keyboard operation | Go through the main flows using only the keyboard | Every operation can be done, and the focus position is visible |

Automated checks detect only some of the violations, so also check keyboard operation.
