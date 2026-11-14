# Component APIs

- Name events in the form `onXxxChange`
- Do not prefix boolean props with `is`, and make them false when omitted
- Confine visual branching to `variant` and `size`
- Pass content through `children`, and compose with clusters
- Make interactive values controlled props by default

## Events

| Use | Do not use |
| --- | --- |
| `onChange`, `onOpenChange`, `onValueChange`, `onCheckedChange`, `onConfirm` | `setFoo`, `handleClick`, `changeOpen`, `onScrollTable` |

When returning a value to the parent, pass the current value first. If needed, add the DOM event as the last argument. Do not leak how the parent updates its Effect Atom into the component.

## Booleans and multiple values

| Use | Do not use |
| --- | --- |
| `open`, `disabled`, `checked`, `required`, `readOnly` | `isOpen`, `isLoading`, `hasMultiple` |
| String unions for `variant` and `size` | A proliferation of booleans for appearance, importing enums |

Confine visual branching to `variant` and `size` of `cva`. When behavioral branching grows, do not add booleans; split the component or compose with clusters.

## Composition

- Pass content through `children`. Do not make `children` a function or an object
- Build dialogs, menus and tables with the same clusters as shadcn/ui, in the shape of `DropdownMenu` with `DropdownMenuTrigger`, `DropdownMenuContent` and `DropdownMenuItem`
- Do not expose slot props such as `header={...}` or `footer={...}`, or `renderHeader`

## Overriding appearance

Do not override color, radius or shadow at the call site. `no-restyle` in `@shadcn/lint` stops it. Only layout and spacing are allowed. When a new appearance is needed, add a `variant` on the component side.

## Control

Make interactive values controlled props by default: the pairs `value` and `onValueChange`, `checked` and `onCheckedChange`, `open` and `onOpenChange`. Keep the container for temporary values in the caller's Effect Atom, not inside the component.

Only for things whose content is fixed, such as a confirmation dialog with fixed wording, string props such as `title`, `description` and `confirmLabel` are fine.
