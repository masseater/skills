# tako で描く

型に対応する部品がある図は、HTML と SVG を手で書かず、[`@r_masseater/tako`](https://www.npmjs.com/package/@r_masseater/tako) で描く。部品が内容から配置を決めるので、座標と余白を図ごとに選び直さずに済み、種類ごとの色と形は [palette.md](../references/palette.md) と同じ値で入る。

## 使う型

- フロー（主役の数字つき）は `flow`、分岐つきのフローは `fork`
- サイクルは `cycle`、ツリーは `tree`、入れ子の箱は `nested`
- タイムラインは `timeline`
- 基準線つきの棒は `bars`

上にない型（漏斗、2 軸の位置づけ図、注記付きの絵、折れ線、積み上げ棒、サンキー図、アイソタイプ、構成図）は、これまでどおり [HTML とインライン SVG で手で描く](../SKILL.md)。tako に部品を足してから使う。

## 手順

1. 図の主役と場面を決める。決め方は [SKILL.md](../SKILL.md) に従う。
2. 作業ディレクトリに `figure.typ` を書く。先頭に `#import "/.tako/tako.typ": *` と `#show: figure` を置き、部品に要素の `kind`（`person`、`system`、`data`、`amount`、`condition`、`outside`）、`icon`（Material Symbols の名前）、短い `body` を渡す。引数は [README](https://github.com/masseater/ecosystems/tree/main/libs/tako#readme) にある。
3. `bunx @r_masseater/tako render figure.typ` を動かす。`figure.light.svg` と `figure.dark.svg` ができる。
4. SVG をブラウザで開いて PNG に書き出し、画像を見て確かめる。確かめる点は [SKILL.md](../SKILL.md) の「書き出した PNG を見て確かめる」と同じである。

## 文字の扱い

tako が書き出す SVG は、文字を `<text>` でなく図形の輪郭にする。検索、翻訳、読み上げが文字を拾えないので、文字を拾わせたい所には `--format pdf` で書き出した PDF を使う。日本語を描くには Noto Sans CJK JP を入れておく。
