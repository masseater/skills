# 図のカタログ

見せたいことから、図の型を選ぶ。先に「何を見せたいか」を、下の 3 つの問いのどれかに決め、型の見本を写して描き始める。型が決まらないときは、見せたいことがまだ決まっていない。

型は 3 つの系統にまとまる。示す関係が 1 つの型には、見本が 1 つずつある。

- 流れと順序は、手順、分かれ道、繰り返し、段階、日付を示す。
- つながりと構造は、渡す相手、親子、内と外、位置、各部の名前を示す。
- 数値は、変化、大小、基準との差、内訳、行き先、数を示す。

型の選び方は、[Financial Times の Visual Vocabulary](https://github.com/Financial-Times/chart-doctor/blob/main/visual-vocabulary/README.md) の 9 つの関係（偏差、相関、順位、分布、時間による変化、大きさ、全体と部分、流れ、空間）を土台にした。数値でない関係（手順、親子、入れ子、各部の名前）は、模式図と注記付きの図解で補った。

## 流れと順序

![手順、分かれ道、繰り返し、段階、日付のどれかで、流れと順序の型を選ぶ](../examples/catalog-flow.svg)

| 見せたいこと | 型 | 系統 | 見本 |
| --- | --- | --- | --- |
| 手順が順に進む | フロー（左から右） | 模式図 | [schematic.svg](../examples/schematic.svg) |
| 条件で分かれる | 分岐つきのフロー | 模式図 | [branching-flow.svg](../examples/branching-flow.svg) |
| 繰り返す | サイクル | 模式図 | [cycle.svg](../examples/cycle.svg) |
| 段階で絞られる | 漏斗 | 模式図 | まだない |
| 日付に沿って並ぶ | タイムライン | 模式図 | [timeline.svg](../examples/timeline.svg) |

## つながりと構造

![渡す相手、親子、内と外、2 つの軸、各部の名前のどれかで、つながりと構造の型を選ぶ](../examples/catalog-structure.svg)

| 見せたいこと | 型 | 系統 | 見本 |
| --- | --- | --- | --- |
| 誰が誰に何を渡すか | 構成図 | 模式図 | [system-map.svg](../examples/system-map.svg) |
| 親と子 | ツリー | 模式図 | [tree.svg](../examples/tree.svg) |
| 内と外、範囲 | 入れ子の箱 | 模式図 | [nested.svg](../examples/nested.svg) |
| 2 つの軸での位置 | 2 軸の位置づけ図 | 模式図 | まだない |
| 各部の名前と働き | 注記付きの絵 | 注記付きの図解 | [annotated.svg](../examples/annotated.svg) |

## 数値

![変化、大小、基準との差、内訳、量の行き先、数のどれかで、数値の型を選ぶ](../examples/catalog-numbers.svg)

| 見せたいこと | 型 | 系統 | 見本 |
| --- | --- | --- | --- |
| 時間でどう変わったか | 折れ線 | エディトリアルのデータ図 | [editorial-chart.svg](../examples/editorial-chart.svg) |
| どちらが大きいか | 棒グラフ | エディトリアルのデータ図 | [bar.svg](../examples/bar.svg) |
| 目標や上限との差 | 基準線つきの棒 | エディトリアルのデータ図 | [threshold.svg](../examples/threshold.svg) |
| 何でできているか | 積み上げ棒 | エディトリアルのデータ図 | [stacked.svg](../examples/stacked.svg) |
| 量の行き先 | サンキー図 | エディトリアルのデータ図 | [sankey.svg](../examples/sankey.svg) |
| ものを数える | 同じ記号の列 | アイソタイプ | [isotype.svg](../examples/isotype.svg) |

## 選ぶときの決まり

- 1 枚の図には 1 つの型だけを使う。2 つの関係を示したいときは、図を 2 枚に分ける。
- 数値が 3 つ以下で、比べる相手がなければ、図にせず文字で書く。[figure-or-text.md](figure-or-text.md) を読む。
- 色の使い方は [palette.md](palette.md)、各系統の描き方は [schematic.md](schematic.md)、[annotated.md](annotated.md)、[editorial-chart.md](editorial-chart.md)、[isotype.md](isotype.md) にある。

## 見本の数値

見本の数値は、すべて確かめた値か、確かめた値から計算した値である。出どころは次のとおり。

- Durable Object が 1 件で書き込む約 14.8 行、1 日に約 $13 かかること、500 サーバー・各 1 日 2,000 件の前提は、2026-11-28 に mirucord の本番で測った値。
- 1 か月の行数（約 4.4 億行、約 3.3 億行）は、1 日の行数に 30 日を掛けた値。含まれる 5,000 万行は Workers Paid の含み分。
- 折れ線の約 56 サーバーは、1 日の含み分（5,000 万行の 30 分の 1）を 1 サーバーが 1 日に書く行数（2,000 件 × 14.8 行）で割った値。
- スキルの数は、masseater/skills の 2026-11-28 時点のディレクトリを数えた値。
