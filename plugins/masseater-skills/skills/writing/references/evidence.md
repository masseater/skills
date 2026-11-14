# 資料で確認したAIの文章スタイルの特徴

AIが記述した文章の特徴（77件）、日本語の文章作成技法（49件）、エッセイやコラムの書き方（45件）に関する資料を、2026年10月25日に収集・集計した結果である。

- 執筆後、段落の最初の一文と文末の一文をすべて抽出し、以下の表と照らし合わせる
- 一つでも一致した場合はその文を置き換えず、段落が伝えたい内容から再構築する
- 資料の数は、その特徴を列挙した記事や論文の数である

## AIが書きがちで、読者が嫌う形式

| 特徴 | 見つけ方 | 直し方 | 資料 |
| --- | --- | --- | --- |
| 中身を言わず、抽象的な言葉や一般論で | 「重要」（important）、「本質」（essence）、「前提」（premise）、「状態」（state）、「形式」（form）または「手段」（means）は主語または述語である | 固有名詞、数値、実際に行われた動作に置き換える | 41 |
| 文末と長さを統一する | 3文連続で同じ文末にする。文の長さを統一する | 終止形は動詞、判断は「だ／である」で結び、否定形を混ぜる | 33 |
| 一次情報なし | 所有者の経験や感覚が一つもない段落 | 所有者が何をやり、何を感じたかから始める。裏付けとして数字を探して付け加えない | 31 |
| 文頭の接続詞 | 「だから」「しかし」「一方で」「つまり」「ただ」で始まる文 | なくても成立する場合は削除する | 21 |
| 断定を避ける | "〜と思う" (I think), "〜だろう" (probably), "〜かもしれない" (might) | 断定的に述べる。できない場合は書かない | 20 |
| ストッククロージングとまとめ | 最後の段落は前の段落を言い換える | 具体的な一文で終わらせる | 19 |
| ストックの前書きと構造的な宣言 | 「答えは 2 つある」「1 つめは」「理由は 3 つ」 | 宣言を削除し、中身から書く | 17 |
| 同義反復 | 前の文を言い換え、結論を繰り返す | 一度だけ書く | 16 |
| 3つのリスト | すべてを3つ並べる | 必要なものを好きなだけ書く | 13 |
| 翻訳語と無生物主語 | "規則が守らせる" (the rules make people keep them), "レビューが担保してくれる" (review guarantees it), "〜を示している" (shows ...) | 人物や組織を主語にする | 12 |
| 「AではなくB」 | 2つ以上の否定的な対比 | 肯定文として書き直し、冠詞は最大1つまでとする | 10 |
| カンマの数と位置 | 「〜は、」「〜に、」「〜ではなく、」などの再帰的カンマ | 長い修飾語の境界や、語順が逆になる場合にのみ配置する | 30th |
| 短い文の連なりと格言的なトーン | 「事業会社がこれを許容してはいけない。」のような決め台詞 | 理由と動作主を同じ文に入れる | 23番目、29番目 |

カンマは、人間が「AIっぽい」と感じた箇所と測定値が一致した唯一の特徴である（広島大学の卒業論文、2026年）。名詞で終わる文の方が、実際には測定値で見ると人間の文章に多く見られるため（fyve、2026年9月）、名詞で終わる文の有無でAIっぽさを判断しない。

## 日本語の文章技法における出典の多いルール

| ルール | 出典 |
| --- | --- |
| 文は40〜60文字。最長で100文字 | 22 |
| 「〜することができる」「〜という」などの冗長な表現は削る | 15 |
| 主語と述語を近づける | 14 |
| 同じ語尾を3回連続で使わない | 12 |
| 接続詞を多用しない | 11 |
| 結論を先に書く | 11 |
| 1段落につき主張を1つ、冒頭にトピックセンテンスを置く | 10 |
| 長い修飾語が2つ以上ある場合のみ境界にカンマを置く（本田勝一） | 9 |
| 抽象的な単語は具体的な単語に置き換える | 9 |
| 逆接ではない「が」を含む文をつなげない | 7 |
| ヘッジを避け、断定的に述べる | 7 |
| 受動態を避け、動作の主体を主語にする | 6 |

## エッセイやコラムにおける出典の多い技法

| 技法 | 出典 |
| --- | --- |
| 抽象的な推論ではなく、具体的な出来事や数字を通じて読者に感じさせる | 9 |
| 前置きなしに、場面や事実から始める | 8 |
| 説明しすぎず、二度書かない | 8 |
| 会話や生の声を取り入れる | 7 |
| 「〜と思う」を省き、断定的に述べる | 5 |
| 最後にまとめず、具体的な内容で締めくくる | 5 |
| 主張を無理強いせず、読者に余白を残す | 5 |
| 断定的に述べるには、自身の経験に基づいた根拠が必要である | 4 |

## 主な出典

- [@textlint-ja/textlint-rule-preset-ai-writing](https://github.com/textlint-ja/textlint-rule-preset-ai-writing)
- [「なんとなくAIっぽい」の正体を180本の記事で特定した](https://qiita.com/kenimo49/items/f47bcf915e4e00140ddf)
- [生成AI以前と以後でエンジニアの文章はどう変わったのか: Qiitaの7万記事を数えてみた話](https://nyosegawa.com/posts/qiita-writing-before-after-ai/)
- [iKora128/stop-ai-slop-jp](https://github.com/iKora128/stop-ai-slop-jp)
- [「AIっぽい文章の特徴」は本当か｜実測で検証する](https://fyve.co.jp/ai-advisor/articles/ai-text-detection-myths-japan)
- [Zaitsu & Jin (2023) Japanese stylometric analysis of ChatGPT-generated papers](https://pmc.ncbi.nlm.nih.gov/articles/PMC10411719)
- [Wang et al. (2025) Is Human-Like Text Liked by Humans?](https://arxiv.org/abs/2502.11614)
- [Pangram, 9 Signs of AI Writing, Backed by Data](https://www.pangram.com/signs-of-ai-writing)
- [語順とテンの原則 - 本多勝一『実戦・日本語の作文技術』](https://tanokura.blog.jp/archives/79247637.html)
- [『理科系の作文技術』講義資料（群馬大学）](https://mems.mst.st.gunma-u.ac.jp/lecture/monodzukuri_13.pdf)
- [公用文作成の考え方（文化審議会、2022年）](https://www.bunka.go.jp/seisaku/bunkashingikai/kokugo/hokoku/pdf/93731901_01.pdf)
- [textlint-rule-preset-ja-technical-writing](https://github.com/textlint-ja/textlint-rule-preset-ja-technical-writing)
- [今日から使える文章校正テクニック（DevelopersIO）](https://dev.classmethod.jp/articles/proofreading-pattern-for-engineer/)
- [エッセイは入り口と出口が9割！書き出しと結びの実例とコツ（公募ガイド）](https://koubo.jp/article/22352)
- [エッセイがうまく書けない理由はこれ！よくある6つの落とし穴と対策（公募ガイド）](https://koubo.jp/article/22349)
- [プロ作家になるための4つの心得（PRESIDENT Online）](https://president.jp/articles/-/6877)
