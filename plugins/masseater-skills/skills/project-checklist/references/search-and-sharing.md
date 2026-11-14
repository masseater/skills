# search-and-sharing

検索エンジンにページが掲載されているか、またリンクが共有された際にどのように表示されるかを確認すること。これを指定しない場合、掲載を希望しないページは掲載され、掲載を希望するページはコンテンツがないまま掲載される。[Google Search Essentials](https://developers.google.com/search/docs/essentials) および [Open Graph プロトコル](https://ogp.me/) を標準として従うこと。

| 確認項目 | 現在の状態を確認する方法 | 満たすための条件 |
| --- | --- | --- |
| 検索エンジンへの掲載 | 本番環境の `robots.txt`、各ページの `meta name="robots"`、および `X-Robots-Tag` ヘッダーを確認する | どのページが掲載され、どのページが掲載されないかは、要件においてユーザーや目的に応じて決定され、そのように設定されている。 |
| 掲載ページの内容 | `curl` で本番環境の HTML を取得し、body、title、description、および canonical が含まれているかを確認する。 | JavaScript を実行せずに、body とメタデータが HTML に含まれている。 |
| 共有時の外観 | 本番環境の HTML で OGP タグを確認し、og:image の URL を開く。 | og:title、og:description、および og:image が存在し、画像が返される。 |
