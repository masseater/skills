---
version: alpha
name: masseater-deck
description: 桜色の一点を持つグラファイトのスケルトン。端まで届くルールと大きな書体で構成された、余白の少ないスライド用デザインシステム。
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
  # ダークテーマ。同名のトークンに -dark という接尾辞を付けたもの。
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
  # サイズは1280 x 720のスライドに基づく値。
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

「Sakura Graphite × Swiss Rules」。グラファイト色のテキストとルールでスケルトンを構築し、団子色の桜色を一点の強調としてのみ使用する。スライドには外余白をほとんど設けず、端から端まで届くルールと大きな書体で情報を配置する。装飾は、スライドを3等分する垂直のガイド線とルールのみである。ただし、役所やサーバー、インターネットなど、絵として描ける図形上のものは、テキストのみのボックスではなくアイコンで描画する。

見出しをスライドの最上部に配置し、その下に端まで届く太いルールを引く。見出しの上に小さなラベル（眉）は置かない。フッターの左端にトピック名を記載し、どのトピックが最新であるかを示す。ページ番号はフッターの右端の隅付近に配置する。見出しのないスライド（テキストのみ、数字のみ、図形のみ）も積極的に活用する。

## Colors

明暗には同じトークン名を使用し、値のみを入れ替える（暗い値は `-dark` を接尾辞とした名称で定義する）。色は oklch で定義する。

| トークン | 役割 |
| --------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| primary（桜色） | 一点の強調。現在の項目、推奨オプション、数字、強調語にのみ使用する。スライドにつき最大1箇所のみ塗りつぶしとして使用する。 |
| secondary, inverse-surface (グラファイト) | スケルトン。レイヤー図の中間層などの暗い塗りつぶしに使用する。 |
| tertiary（青緑） | 補助的。図の中でprimary 側と並べて区別したい場合にのみ使用する。 |
| surface, surface-container | surfaceは背景、surface-containerはその上に配置する塗りつぶし。 |
| outline | ガイド線と細い区切り線 |

## Typography

本文と見出しには Noto Sans JP を、ラベルと数字には等幅の JetBrains Mono を使用する。等幅書体にはない日本語文字は Noto Sans JP で描画する。いずれも libs/design の Fontsource npm パッケージから読み込み、単一の HTML に埋め込む。OS の書体に依存しないため、HTML と PDF はどの環境でも同じ書体を表示する。サイズは1280 x 720のスライドに基づく値であり、実装ではスライド幅（cqw）の比率に換算してスケールする。

見出しには headline-lg を使用し、カバーには headline-display のみを使用する。headline-lg はウェイト 800 で 56px とし、文字間隔を -0.03em に詰める。本文は body-lg および body-md とし、スライドには（フッターと注記を除き）22px 未満のテキストを使用しない。数字とラベルには等幅の label-* を使用し、ラテン文字のラベルは大文字で文字間隔を広く設定する。

## Layout

スライドは 16:9 とする。内余白は小さく抑え、上部 18px、左右 38px、下部（フッター） 76px とする。見出しのルールと箇条書きの行区切り線は、左右の余白を通ってスライドの端まで描画する。

背景に2本の垂直なガイド線を引いて3等分し、要素を概ねこれら3つの列に揃える。フッターは下端から 18px の位置に配置し、左側にトピック名と著者名、右側にページ番号を記載する。

## Elevation & Depth

影は使用しない。レイヤーの重ね合わせは、塗りつぶし（surface と surface-container）とルールの差分のみで表現する。

## Shapes

角の半径は小さい（sm 6px / md 10px / lg 14px）。ページ番号の正方形の角は丸くしない。円はステップやタイムラインの点など、位置を示す印としてのみ使用する。

## Components

スライドのコンポーネントは `libs/deck` で実装する。`vp run slides` はカタログを `apps/slides/dist/decks/deck-catalog.html` および `.pdf` に出力する。

| 種類 | コンポーネント |
| --------------------- | --------------------------------------------------------------------------------------------- |
| 見出し付き | 箇条書き、2列、アジェンダ、ステップ、水平・垂直タイムライン、比較、オプション |
| 見出しなし | カバー、セクション区切り、テキストのみ、中央揃え、単一単語、数字、引用、質問、終了 |
| 見出しなしの図 | フロー、レイヤー、4つの象限 |

`libs/deck` の `Icon` を使用してアイコンを描画し、`@material-symbols/svg-400` の SVG を画像として渡す。オプション、ステップ、比較コンポーネントは、項目ごとに `icon` を受け付ける。

アプリコンポーネントは `libs/ui` で実装する。カタログは同じ `deck-catalog.html` の後半部分にある。

| コンポーネント | ルール |
| --------- | ---------------------------------------------------------------------------------- |
| Button  | primary・secondary・ghostの3種類。primaryは1画面に1つまでにする |
| Badge   | neutral・primary・tertiary・errorの4種類                        |
| Card    | 上端の太い罫線とsurface-containerの面で区切る                   |
| Callout | note(tertiary)・important(primary)・caution(error)の3種類       |
| Table   | 見出し行の下に太い罫線を引き、行は細い区切り線で分ける          |
| Code    | inverse-surfaceの面に等幅で置き、言語名をprimaryで添える        |

## Do's and Don'ts

|       | ルール |
| ----- | ----------------------------------------------------------------------------------------- |
| Do | スライド1枚が1つの内容に何を伝えるかを絞り込み、テキストを大きくする。 |
| Do | 強調はprimary の1点に限定する。現在の項目、推奨オプション、および強調された単語に使用する。 |
| Do | トピック名をフッターに配置し、見出しの上には何も配置しない。 |
| Do | 図の要素にアイコンを付与し、どの概念であるかが画像から明確になるようにする。 |
| Don't | スライドの外周に大きな余白を設けない。 |
| Don't | シャドウ、グラデーション、または単なる装飾用アイコンを使用しない。 |
| Don't | 図の要素を、テキストのみのボックスとして描画しない。 |
| Don't | コンポーネント内に色値を直接記述しない。常にトークン名で参照する。 |
