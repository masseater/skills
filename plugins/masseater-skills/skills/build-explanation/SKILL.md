---
name: build-explanation
description: 読み手が既知の情報を起点とし、次に問われる質問に答える順序で展開する解説を、読み手向けに作成するための手順書。スライドの構成やスピーカースクリプト、および解説、提案書、報告書の本文を作成する際に活用する。
---

# build-explanation

解説が伝わるかどうかは、内容の正しさよりも、読み手の頭の中で理解が組み立てられる順序になっているかによって決まる。このスキルでは、新しいことをどう理解するかに応じて、話の順序を決定する手順を提示する。スライドの場合、このスキルは構成とスピーカースクリプトで活用される。見た目や言い回しのルールはここでは扱わず、文章はyomiyasuでブラッシュアップされる。

## 解説をどう理解するか

解説を組み立てる各ステップは、以下の7つの特性に基づいている。出典は末尾の参考文献に記載されている。

| 特性 | 解説にとっての意味 |
| --- | --- |
| 新しい情報は、すでに分かっていることと結びついて初めて理解できる。 | 読み手が知っていることから始める。内容を把握せずに読んだテキストは、一文ずつは理解できるが、全体としては理解できず、記憶にも残らない。 |
| 一度に頭の中に保持できるのは、約4つの要素である。 | 用途が不明な箇所を先に並べると、読み手は意味のない要素を抱えたまま読み進めなければならなくなる。 |
| 人は疑問を持ったときに回答を受け止める。 | 回答の前に、読み手がその答えを知りたいと思わせるような問いを立てる。特に大人は、なぜそれを知る必要があるのかが分かるまで、学ぼうとしない。 |
| 具体的なものから抽象的なものへと進めることで、理解しやすくなる。 | まずは馴染みのある例や実物を提示し、そこから一般化された言葉や仕組みへと移行する。 |
| 物語形式のテキストは、説明的なテキストよりも理解しやすく、記憶に残りやすい。 | 項目を列挙するのではなく、質問と回答を紐づけて起点から進む、一つの連続した物語にする。 |
| 読み手が抱いている誤解は、正しい解説を加えるだけでは消えない。 | よくある誤解を挙げ、それを否定し、なぜそれが間違っているのかを示す。 |
| 何が理解しやすいかは、読み手の知識次第である。 | 順序を決める前に、想定読者を定める。知っている人には通用する省略が、知らない人には飛躍となる。 |

## ユースケース

- [`build-outline`](usecases/build-outline.md)。核心となる文と読み手の起点を決め、疑問の連鎖でアウトラインを組み立て、読み手の立場で確かめる。

## 参照箇所

| 参照箇所 | 削除箇所 |
| --- | --- |
| Bransford, J. D., & Johnson, M. K. (1972). Contextual prerequisites for understanding. _Journal of Verbal Learning and Verbal Behavior_, 11(6). [DOI](<https://doi.org/10.1016/S0022-5371(72)80006-4>) | 最初に内容を伝えなかった人は、同じ文章を理解できなかったり、思い出せなかったりした。まず話の文脈を示す。 |
| Ausubel, D. P. (1960). The use of advance organizers in the learning and retention of meaningful verbal material. _Journal of Educational Psychology_, 51(5). [DOI](https://doi.org/10.1037/h0046669) | 新しい内容の前に、読み手の既有知識と結びつける枠組み（アドバンスド・オーガナイザー）を設ける。 |
| Haviland, S. E., & Clark, H. H. (1974). _Journal of Verbal Learning and Verbal Behavior_, 13(5). [DOI](<https://doi.org/10.1016/S0022-5371(74)80003-4>) | 読み手は、既知の情報を手がかりにして新しい情報を結びつける。既知の情報から未知の情報へと書き進める。 |
| Cowan, N. (2001). The magical number 4 in short-term memory. _Behavioral and Brain Sciences_, 24(1). [DOI](https://doi.org/10.1017/S0140525X01003922) | 一度に約4つの要素を保持できる |
| Sweller, J., van Merriënboer, J. J. G., & Paas, F. (2019). Cognitive architecture and instructional design: 20 years later. _Educational Psychology Review_, 31. [DOI](https://doi.org/10.1007/s10648-019-09465-5) | 認知負荷理論。相互に関連する要素を一度に多く扱うほど、負荷は高くなる。初心者に有効な手法が専門家には逆効果となる（専門性逆転効果）。 |
| Loewenstein, G. (1994). The psychology of curiosity. _Psychological Bulletin_, 116(1). [DOI](https://doi.org/10.1037/0033-2909.116.1.75) | 好奇心は、自分が知っていることと知りたいことの間にギャップに気づいたときに生じる。 |
| Kang, M. J., et al. (2009). The wick in the candle of learning. _Psychological Science_, 20(8). [PubMed](https://pubmed.ncbi.nlm.nih.gov/19619181/) | 人々が好奇心を抱いていた問いへの回答は、後になってよりよく思い出された。 |
| Richland, L. E., Kornell, N., & Kao, L. S. (2009). The pretesting effect. _Journal of Experimental Psychology: Applied_, 15(3). [PDF](https://learninglab.uchicago.edu/Pre-Testing_files/RichlandKornellKao.pdf) | 回答を読む前に問いに取り組むことで、回答の学習効果が向上した。回答の前に問いを置く。 |
| Knowles, M. S. のアンドラゴジー(成人学習論) [解説](https://tecfa.unige.ch/themes/sa2/act-app-dos2-fic-andragog.htm) | 成人は、なぜそれを学ぶ必要があるのかを理解した上で学習する。 |
| Reigeluth, C. M. の精緻化理論 [解説](https://www.instructionaldesign.org/?p=133) | 全体を単純な形で一度示し、そこから各部分を精緻化する。 |
| Mayer, R. E. の事前訓練の原則 [書誌](https://www.cambridge.org/core/books/abs/multimedia-learning/pretraining-principle/01791D57F5D4164251269E6DF56A8BF1) | メカニズムの流れを説明する直前に、各部分の名称と機能を示すことで理解が深まる。`build-outline` のステップ5の例外の根拠として用いられる。 |
| Fyfe, E. R., McNeil, N. M., Son, J. Y., & Goldstone, R. L. (2014). Concreteness fading in mathematics and science instruction. _Educational Psychology Review_, 26. [DOI](https://doi.org/10.1007/s10648-014-9249-3) | 具体的なことから始め、徐々に抽象的な内容へと移行する |
| Gentner, D. (1983). Structure-mapping. _Cognitive Science_, 7(2). [DOI](https://doi.org/10.1207/s15516709cog0702_3) | 類推は、要素間の関係の対応関係を通じて理解される。その対応関係を明示する。 |
| Mar, R. A., et al. (2021). Memory and comprehension of narrative versus expository texts. _Psychonomic Bulletin & Review_, 28. [DOI](https://doi.org/10.3758/s13423-020-01853-1) | 33,000人以上を対象としたメタ分析において、叙述文は説明文よりも理解および記憶の面で優れていた (g=0.55)。 |
| Schroeder, N. L., & Kucera, A. C. (2022). Refutation text facilitates learning. _Educational Psychology Review_, 34. [DOI](https://doi.org/10.1007/s10648-021-09656-z) | 誤解を指摘し否定するテキストは、通常の説明よりも学習を促進した (g=0.41)。 |
| Petty, R. E., Cacioppo, J. T., & Goldman, R. (1981). Personal involvement as a determinant of argument-based persuasion. _Journal of Personality and Social Psychology_, 41(5). [DOI](https://doi.org/10.1037/0022-3514.41.5.847) | 講演が人々に関わるものであればあるほど、論証の質によってより強く説得される。`build-outline` のステップ10の根拠として用いられる。 |
