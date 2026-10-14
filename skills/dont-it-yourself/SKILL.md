---
name: dont-it-yourself
description: ライブラリ、ランタイム、リポジトリにすでにあるものを探して使い、自前で作らない。新しい処理、ヘルパー、ラッパー、ツール、外部 API のクライアントを書き始める前に使う。
metadata:
  derived-from: https://github.com/masseater/cc-jev-teacher/tree/5dbbf4abd9b3a5b1a74bc30c89ca7bd6712bd929/plugins/cc-jev-teacher/skills/dont-it-yourself
---

# dont-it-yourself

既存のものを探して使い、自前で作らないための規則である。

- 既存のものがあれば、それを使う
- 既存の関数を包むだけのラッパーは作らない。呼び出し側で既存の関数をそのまま使う
- 既存のもので足りない部分だけを書く。拡張用の API やオプションがあれば、それで足す

## この skill が必要な理由と達成したい状態

この skill が必要な理由は、AI にとって書くほうが探すより速く、知っている範囲で書けてしまうことにある。AI の知識は学習した時点で止まっていて、その後に出たパッケージや、検索結果の要約に出てこなかったパッケージを知らない。だから既存のものがあっても、無いものとして自作を始める。自作したものは、作る手間に加えて、既存のものなら作者が担っていた保守を背負う。

この skill で達成したい状態は、リポジトリにあるコードが、既存のものでは足りない部分だけでできていることである。

## 探し方

[`libraries`](references/libraries.md) も読むこと。その場面で使うものが載っていれば、それを使う。

載っていなければ [`find-existing`](usecases/find-existing.md) の手順で探す。
