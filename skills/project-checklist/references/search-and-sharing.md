# search-and-sharing

検索に載せるかと、リンクを共有したときの見え方を確かめる。決めないと、載せたくないページが載り、載せたいページが中身の無いまま載る。基準は [Google 検索の基本事項](https://developers.google.com/search/docs/essentials) と [Open Graph protocol](https://ogp.me/) に従う。

| 確かめること | 今の状態の確かめ方 | 満たす状態 |
| --- | --- | --- |
| 検索に載せるかどうか | 本番の `robots.txt`、各ページの `meta name="robots"`、`X-Robots-Tag` ヘッダーを見る | requirements の使う人と目的に合わせて、載せるページと載せないページが決まっていて、そのとおりになっている |
| 載せるページの中身 | 本番の HTML を `curl` で取り、本文、title、description、canonical があるかを見る | JavaScript を動かさなくても、中身とメタデータが HTML にある |
| 共有したときの表示 | 本番の HTML の OGP のタグを見て、og:image の URL を開く | og:title、og:description、og:image があり、画像が返る |
