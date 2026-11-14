---
version: alpha
name: masseater-deck
description: A graphite skeleton with a single point of cherry-blossom pink. A design system for slides with little whitespace, built from rules that reach the edges and large type.
colors:
  primary: "oklch(0.6 0.16 3)"
  on-primary: "oklch(0.99 0.01 3)"
  secondary: "oklch(0.36 0.005 285)"
  on-secondary: "oklch(0.98 0 0)"
  tertiary: "oklch(0.62 0.06 190)"
  on-tertiary: "oklch(0.98 0.01 190)"
  neutral: "oklch(0.56 0.005 285)"
  surface: "oklch(0.978 0.003 350)"
  surface-container: "oklch(0.945 0.006 350)"
  on-surface: "oklch(0.25 0.006 285)"
  on-surface-variant: "oklch(0.47 0.006 285)"
  inverse-surface: "oklch(0.36 0.005 285)"
  on-inverse-surface: "oklch(0.98 0 0)"
  outline: "oklch(0.86 0.006 330)"
  error: "oklch(0.52 0.19 30)"
  on-error: "oklch(0.98 0.01 30)"
  # Dark theme. Tokens with the same names plus a -dark suffix
  primary-dark: "oklch(0.78 0.12 3)"
  on-primary-dark: "oklch(0.25 0.06 3)"
  secondary-dark: "oklch(0.82 0.005 285)"
  on-secondary-dark: "oklch(0.2 0.005 285)"
  tertiary-dark: "oklch(0.78 0.06 190)"
  on-tertiary-dark: "oklch(0.22 0.03 190)"
  neutral-dark: "oklch(0.64 0.005 285)"
  surface-dark: "oklch(0.2 0.005 285)"
  surface-container-dark: "oklch(0.25 0.007 300)"
  on-surface-dark: "oklch(0.94 0.004 350)"
  on-surface-variant-dark: "oklch(0.74 0.006 300)"
  inverse-surface-dark: "oklch(0.27 0.008 300)"
  on-inverse-surface-dark: "oklch(0.94 0.004 350)"
  outline-dark: "oklch(0.36 0.008 300)"
  error-dark: "oklch(0.72 0.16 30)"
  on-error-dark: "oklch(0.2 0.05 30)"
typography:
  # Sizes are values based on a 1280 x 720 slide
  headline-display:
    fontFamily: "Noto Sans JP Variable, sans-serif"
    fontSize: 128px
    fontWeight: 800
    lineHeight: 0.95
    letterSpacing: -0.04em
  headline-lg:
    fontFamily: "Noto Sans JP Variable, sans-serif"
    fontSize: 56px
    fontWeight: 800
    lineHeight: 1.25
    letterSpacing: -0.03em
  headline-md:
    fontFamily: "Noto Sans JP Variable, sans-serif"
    fontSize: 36px
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: -0.01em
  body-lg:
    fontFamily: "Noto Sans JP Variable, sans-serif"
    fontSize: 32px
    fontWeight: 400
    lineHeight: 1.6
  body-md:
    fontFamily: "Noto Sans JP Variable, sans-serif"
    fontSize: 28px
    fontWeight: 400
    lineHeight: 1.7
  body-sm:
    fontFamily: "Noto Sans JP Variable, sans-serif"
    fontSize: 22px
    fontWeight: 400
    lineHeight: 1.6
  label-lg:
    fontFamily: "JetBrains Mono Variable, Noto Sans JP Variable, monospace"
    fontSize: 24px
    fontWeight: 800
    lineHeight: 1
  label-md:
    fontFamily: "JetBrains Mono Variable, Noto Sans JP Variable, monospace"
    fontSize: 18px
    fontWeight: 700
    lineHeight: 1
    letterSpacing: 0.12em
  label-sm:
    fontFamily: "JetBrains Mono Variable, Noto Sans JP Variable, monospace"
    fontSize: 16px
    fontWeight: 500
    lineHeight: 1
rounded:
  none: 0px
  sm: 6px
  md: 10px
  lg: 14px
  xl: 20px
  full: 9999px
spacing:
  xs: 8px
  sm: 16px
  md: 32px
  lg: 48px
  xl: 64px
components:
  slide:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    padding: 18px 38px 76px
  slide-heading:
    typography: "{typography.headline-lg}"
    textColor: "{colors.on-surface}"
  slide-footer:
    typography: "{typography.label-sm}"
    textColor: "{colors.on-surface-variant}"
  page-number:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.none}"
  highlight:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.md}"
  panel:
    backgroundColor: "{colors.surface-container}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.md}"
  panel-inverse:
    backgroundColor: "{colors.inverse-surface}"
    textColor: "{colors.on-inverse-surface}"
    rounded: "{rounded.md}"
---

# masseater-deck

## Overview

"Sakura Graphite × Swiss Rules". Build the skeleton with graphite-colored text and rules, and use the dango cherry-blossom pink only as a single point of emphasis. Slides take almost no outer margin, and lay out information with rules that reach from edge to edge and large type. The only decoration is the vertical guide lines that divide the slide into thirds, and rules. However, things in a figure that can be drawn as pictures, such as a government office, a server or the internet, are drawn with icons rather than as text-only boxes.

Put the heading at the very top of the slide, and draw a thick rule under it that reaches the edges. Do not put a small label (eyebrow) above the heading. Show which topic is current with the topic name at the left end of the footer. Put the page number near the corner at the right end of the footer. Actively use slides without headings too (text only, numbers only, figures only).

## Colors

Use the same token names for light and dark, swapping only the values (dark values are defined with names suffixed with `-dark`). Define colors in oklch.

| Token                                   | Role                                                                                                                                         |
| --------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| primary (cherry-blossom pink)           | The single point of emphasis. Use only for the current item, the recommended option, numbers and emphasized words. Use it as a fill in at most one place per slide |
| secondary, inverse-surface (graphite)   | The skeleton. Use for dark fills such as the middle tier of a layer diagram                                                                  |
| tertiary (blue-green)                   | Auxiliary. Use only when you want to distinguish something from primary side by side in a figure                                            |
| surface, surface-container              | surface is the background, and surface-container is a fill placed on top of it                                                              |
| outline                                 | Guide lines and thin dividers                                                                                                                |

## Typography

Use Noto Sans JP for body text and headings, and the monospaced JetBrains Mono for labels and numbers. Japanese characters that the monospaced typeface lacks are rendered in Noto Sans JP. Both are loaded from Fontsource npm packages in libs/design and embedded into the single HTML. Because nothing relies on OS typefaces, the HTML and PDF show the same typefaces in any environment. Sizes are values based on a 1280 x 720 slide, and the implementation converts them to a proportion of the slide width (cqw) to scale.

Use headline-lg for headings, and headline-display only for the cover. headline-lg is 56px at weight 800, with letter spacing tightened by -0.03em. Body text is body-lg and body-md, and slides use no text smaller than 22px (except the footer and notes). Use the monospaced label-* for numbers and labels, and set Latin labels in uppercase with wider letter spacing.

## Layout

Slides are 16:9. The inner margins are kept small: 18px at the top, 38px left and right, and 76px at the bottom (for the footer). The heading rule and the row dividers of bullet lists are drawn through the left and right margins to the edges of the slide.

Draw two vertical guide lines on the background to divide it into thirds, and align elements roughly to these three columns. Put the footer 18px from the bottom edge, with the topic name and author name on the left and the page number on the right.

## Elevation & Depth

Do not use shadows. Express layering only with the difference between fills (surface and surface-container) and rules.

## Shapes

Corner radii are small (sm 6px / md 10px / lg 14px). The page number square has no rounded corners. Use circles only as marks that indicate position, such as the points of steps and timelines.

## Components

Slide components are implemented in `libs/deck`. `vp run slides` outputs a catalog to `apps/slides/dist/decks/deck-catalog.html` and `.pdf`.

| Kind                  | Components                                                                                    |
| --------------------- | --------------------------------------------------------------------------------------------- |
| With heading          | Bullets, two columns, agenda, steps, horizontal and vertical timelines, comparison, options   |
| Without heading       | Cover, section divider, text only, centered, single word, number, quote, question, closing    |
| Figures without heading | Flow, layers, four quadrants                                                                |

Draw icons with `Icon` from `libs/deck`, passing SVGs from `@material-symbols/svg-400` as images. The options, steps and comparison components accept an `icon` per item.

App components are implemented in `libs/ui`. The catalog is in the second half of the same `deck-catalog.html`.

| Component | Rules                                                                              |
| --------- | ---------------------------------------------------------------------------------- |
| Button    | Three kinds: primary, secondary and ghost. At most one primary per screen          |
| Badge     | Four kinds: neutral, primary, tertiary and error                                   |
| Card      | Separated by a thick rule at the top and a surface-container fill                  |
| Callout   | Three kinds: note (tertiary), important (primary) and caution (error)              |
| Table     | Draw a thick rule under the header row, and divide rows with thin dividers         |
| Code      | Set in monospace on an inverse-surface fill, with the language name in primary     |

## Do's and Don'ts

|       | Rules                                                                                     |
| ----- | ----------------------------------------------------------------------------------------- |
| Do    | Narrow what one slide says to one thing, and make the text large                         |
| Do    | Limit emphasis to a single point of primary. Use it for the current item, the recommended option and emphasized words |
| Do    | Put the topic name in the footer, and put nothing above the heading                      |
| Do    | Give figure elements icons so that what concept they are is clear from the picture       |
| Don't | Do not take large margins around the outside of the slide                                 |
| Don't | Do not use shadows, gradients or purely decorative icons                                  |
| Don't | Do not draw figure elements as boxes with only text in them                               |
| Don't | Do not write color values directly in components. Always refer to them by token name      |
