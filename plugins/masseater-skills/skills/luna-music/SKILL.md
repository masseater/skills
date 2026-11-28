---
name: luna-music
description: クラウドから SSH で持ち主の Windows PC につなぎ、UA の DAW「LUNA」のセッションにドラムパターンなどを組み、書き出したステムを測って検証する。LUNA で曲やパートを作るとき、リファレンス曲に合わせるとき、LUNA で作ったものが意図どおりか音を聴かずに確かめるときに使う。
---

# luna-music

## このスキルが存在する理由と目指すべき状態

このスキルが必要な理由は、LUNA で音楽を作る AI が結果の音を聴けないからである。確かめないまま「できた」と報告するか、検証していない結果を持ち主に渡すことになる。すると持ち主は、測れば AI が見つけられたはずの誤りを探すために、修正のたびに聴くことになる。誤りとは、違うステップに置かれた音、聴き取れないほど小さいハット、割れているマスターなどである。LUNA は持ち主の Windows PC で動き、AI はクラウドで動くので、毎回の作業で接続の方法、呼ぶ API、ドキュメントに書かれていない事実を調べ直すことにもなる。

このスキルが目指す状態は、持ち主が LUNA でパートや曲を頼むと、AI が持ち主の開いて直せるセッションに組み、タイミング、バランス、レベルが意図どおり（リファレンスがあればそれに合っている）と測定で確かめてから渡すことである。持ち主は欠陥を探すためではなく、好みを判断するために一度だけ聴けばよい。

## ルール

- PC にはクラウドのセッションから SSH でつなぐ（[`connect-to-luna`](usecases/connect-to-luna.md)）。Remote Control は起動しない。持ち主がすでに SSH の経路を用意していて、Remote Control を使わないよう頼んでいるからである。
- LUNA は、PC 上の Node スクリプトから Luna Builder SDK 経由で操作する。SDK にセッションを編集するコマンドは付いていないので、`Luna.connect()` を呼ぶスクリプトを書く。
- 結果は持ち主が開ける LUNA のセッションに置く。楽器ごとに 1 トラック、1 発ごとに 1 クリップとし、LUNA の中で 1 発ずつ動かし、切り詰め、ミュートできるようにする。パターンを 1 本のオーディオファイルに書き出して済ませない。
- 合成した音ではなく、実物の楽器のサンプルを使う。持ち主は合成のドラムを不適切と判断した。Windows 版の LUNA に入っているインストゥルメントは Polymax だけなので、ドラムはワンショットの WAV をクリップとして並べる。サンプルはライセンスが分からないものが多いので、PC に置いたままにし、どのリポジトリにも入れない。
- スクリプトを読んだだけで結果を正しいと報告しない。LUNA からステムを書き出し、[`verify-audio`](usecases/verify-audio.md) の検査を実行して、測った値を報告する。音そのものは聴いていないと明記する。
- 持ち主がリファレンス曲を渡したときは、[`match-reference`](usecases/match-reference.md) に従う。テンポ、音の位置、スウィング、音色をリファレンスから取り、報告の前に結果をリファレンスと測定で比べる。
- SDK はベータ版で数日ごとに変わるので、LUNA と SDK の最新のバージョンを毎回確認する。

## ユースケース

- クラウドから LUNA につなぐ：[`connect-to-luna`](usecases/connect-to-luna.md)
- セッションにパターンを組む：[`make-pattern`](usecases/make-pattern.md)
- 聴かずに出来を確かめる：[`verify-audio`](usecases/verify-audio.md)
- パターンをリファレンス曲に寄せる：[`match-reference`](usecases/match-reference.md)

## 参照

- LUNA Builder SDK のドキュメントに書かれていない事実：[`luna-facts`](references/luna-facts.md)
- 検証の指標と合格の基準：[`verification-metrics`](references/verification-metrics.md)
- 音声を入力できるモデルで聴くときの扱いと、試した結果：[`listening-models`](references/listening-models.md)
- ドラムを分離してスウィングとハットの並びを測る手順：[`separate-drums`](references/separate-drums.md)
