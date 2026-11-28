---
name: luna-music
description: クラウドから SSH で持ち主の Windows PC の LUNA（UA の DAW）につなぎ、セッションにトラック、クリップ、ノートを置き、ステムを書き出すときに使う。UA 公式プラグインのスキルに書かれていない LUNA の使い方と事実だけを持つ。
---

# luna-music

## このスキルが存在する理由と目指すべき状態

このスキルが必要な理由は、LUNA が持ち主の Windows PC で動き、AI がクラウドで動くうえ、Luna Builder SDK がベータ版で、ドキュメントどおりに動かない API があるからである。UA 公式プラグインのスキルは SDK の使い方を書いているが、クラウドからの接続の方法と、試して分かった食い違いは書いていない。それがないと、AI は毎回の作業で接続の方法を調べ直し、同じ API で同じ失敗をする。

このスキルが目指す状態は、AI がクラウドから迷わず持ち主の開いている LUNA のセッションにつながり、置いたものと書き出したものが意図どおりになることである。

## ルール

- SDK の基本的な使い方は UA 公式プラグイン（`claude plugin install ua-luna-builder@luna-builder-sdk`）のスキルに従い、このスキルにはそこに書かれていないことだけを書く。
- PC にはクラウドのセッションから SSH でつなぐ（[`connect-to-luna`](usecases/connect-to-luna.md)）。Remote Control は起動しない。持ち主がすでに SSH の経路を用意していて、Remote Control を使わないよう頼んでいるからである。
- LUNA は、PC 上の Node スクリプトから SDK 経由で操作する。SDK にセッションを編集するコマンドは付いていないので、`Luna.connect()` を呼ぶスクリプトを書く。
- Windows 版の LUNA に入っているインストゥルメントは Polymax だけなので、ドラムはワンショットの WAV をクリップとして並べる。
- SDK は数日ごとに変わるので、LUNA と SDK の最新のバージョンを毎回確認し、[`luna-facts`](references/luna-facts.md) の事実が今も成り立つかを確かめる。

## ユースケース

- クラウドから LUNA につなぐ：[`connect-to-luna`](usecases/connect-to-luna.md)
- セッションにトラック、クリップ、ノートを置く：[`build-session`](usecases/build-session.md)
- ステムとメインを書き出す：[`export-stems`](usecases/export-stems.md)

## 参照

- LUNA Builder SDK のドキュメントに書かれていない事実：[`luna-facts`](references/luna-facts.md)
