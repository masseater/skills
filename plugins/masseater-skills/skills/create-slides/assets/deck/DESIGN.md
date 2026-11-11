---
version: alpha
name: masseater-deck
description: 黒鉛色の骨格に桜色を一点。端まで届く罫線と大きな文字で組む、余白の少ないスライド用デザインシステム。
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
  # ダークテーマ。名前の末尾に -dark を付けた同名トークン
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
  # サイズは 1280 x 720 のスライドを基準にした値
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

「Sakura Graphite × Swiss Rules」。黒鉛色(グラファイト)の文字と罫線で骨格を作り、団子の桜色を強調の一点にだけ使う。スライドは外側の余白をほとんど取らず、端から端まで届く罫線と大きな文字で情報を並べる。飾りは3分割の縦の補助線と罫線だけにする。ただし図の中で役所、サーバー、インターネットのように絵にできるものは、文字だけの箱にせずアイコンを描く。

見出しはスライドの一番上に置き、下に端まで届く太い罫線を引く。見出しの上に小さなラベル(アイブロウ)は置かない。今どの話題かは、フッター左端の話題名で示す。ページ番号はフッター右端の角の近くに置く。見出しのないスライド(文章だけ、数字だけ、図だけ)も積極的に使う。

## Colors

ライトとダークで同じトークン名を使い、値だけを差し替える(ダークの値は `-dark` を付けた名前で定義)。色はoklchで定義する。

| トークン                           | 役割                                                                                                   |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------ |
| primary(桜色)                      | 強調の一点。今いる項目、推奨案、番号、強調語だけに使う。1枚のスライドで面として使うのは1か所までにする |
| secondary、inverse-surface(黒鉛色) | 骨格。層の図の中段のような濃い面に使う                                                                 |
| tertiary(青緑)                     | 補助。図の中でprimaryと並べて区別したいときだけ使う                                                    |
| surface、surface-container         | surfaceは背景、surface-containerはその上に置く面                                                       |
| outline                            | 補助線と細い区切り線                                                                                   |

## Typography

本文と見出しはNoto Sans JP、ラベルと番号は等幅のJetBrains Monoを使う。等幅の書体が持たない和文はNoto Sans JPで出す。どちらもFontsourceのnpmパッケージをlibs/designから読み込み、単一HTMLへ埋め込む。OSの書体に頼らないので、HTMLとPDFはどの環境で開いても同じ書体で出る。サイズは1280 x 720のスライドを基準にした値で、実装ではスライド幅に対する割合(cqw)に換算して拡大縮小する。

見出しはheadline-lgを使い、表紙だけheadline-displayにする。headline-lgは56pxの太さ800で、字間を-0.03em詰める。本文はbody-lgとbody-mdで、スライドでは22px未満の文字を使わない(フッターと注記を除く)。番号とラベルは等幅のlabel-*を使い、英字ラベルは大文字にして字間を空ける。

## Layout

スライドは16:9である。内側の余白は上18px・左右38px・下76px(フッター分)と小さく取る。見出しの罫線と箇条書きの行区切りは、左右の余白を突き抜けてスライドの端まで引く。

背景には縦の補助線を2本引いて3分割し、要素はこの3列を目安に揃える。フッターは下端から18pxに置き、左に話題名と作者名、右にページ番号を並べる。

## Elevation & Depth

影は使わない。面の差(surfaceとsurface-container)と罫線だけで重なりを表す。

## Shapes

角丸は小さめ(sm 6px / md 10px / lg 14px)。ページ番号の四角は角丸なし。円は手順・年表の点など、位置を示す印にだけ使う。

## Components

スライドの部品は `libs/deck` に実装している。一覧は `vp run slides` で `apps/slides/dist/decks/deck-catalog.html` と `.pdf` に出力される。

| 種類           | 部品                                                              |
| -------------- | ----------------------------------------------------------------- |
| 見出しあり     | 箇条書き・2カラム・目次・手順・横と縦のタイムライン・比較・選択肢 |
| 見出しなし     | 表紙・中扉・文章だけ・中央揃え・一語・数字・引用・問いかけ・締め  |
| 見出しなしの図 | 流れ・層・4象限                                                   |

アイコンは `libs/deck` の `Icon` で描き、画像は `@material-symbols/svg-400` のSVGを渡す。選択肢・手順・比較の部品は、項目ごとに `icon` を受け取る。

アプリ用の部品は `libs/ui` に実装している。一覧は同じ `deck-catalog.html` の後半にある。

| 部品    | 決まり                                                          |
| ------- | --------------------------------------------------------------- |
| Button  | primary・secondary・ghostの3種類。primaryは1画面に1つまでにする |
| Badge   | neutral・primary・tertiary・errorの4種類                        |
| Card    | 上端の太い罫線とsurface-containerの面で区切る                   |
| Callout | note(tertiary)・important(primary)・caution(error)の3種類       |
| Table   | 見出し行の下に太い罫線を引き、行は細い区切り線で分ける          |
| Code    | inverse-surfaceの面に等幅で置き、言語名をprimaryで添える        |

## Do's and Don'ts

|       | 決まり                                                         |
| ----- | -------------------------------------------------------------- |
| Do    | 1枚で言いたいことを1つに絞り、文字を大きくする                 |
| Do    | 強調はprimaryの一点だけにする。今の項目・推奨案・強調語に使う  |
| Do    | 話題名はフッターに置き、見出しの上には何も置かない             |
| Do    | 図の要素は、何の概念かが絵で分かるようにアイコンを付ける       |
| Don't | スライドの外周に大きな余白を取らない                           |
| Don't | 影、グラデーション、装飾だけのアイコンを使わない               |
| Don't | 図の要素を、文字を入れただけの箱で描かない                     |
| Don't | 色の値をコンポーネントに直接書かない。必ずトークン名で参照する |
