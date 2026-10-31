---
name: dont-it-yourself
description: ライブラリ、ランタイム、リポジトリにすでにあるものを探して使い、自前で作らない。新しい処理、ヘルパー、ラッパー、ツール、外部 API のクライアントを書き始める前に使う。
metadata:
  derived-from: https://github.com/masseater/cc-jev-teacher/tree/5dbbf4abd9b3a5b1a74bc30c89ca7bd6712bd929/plugins/cc-jev-teacher/skills/dont-it-yourself
---

# dont-it-yourself

既存のものを探して使い、自前で作らないための規則である。

- 既存のものがあれば、それを使う
- 既存の関数を包むだけのラッパーは作らず、呼び出し側で既存の関数をそのまま使う
- 既存のもので足りない部分だけを書く
- 足りない部分は、拡張用の API やオプションがあればそれで足す

包むだけのラッパーも、自作したものと同じく保守を背負う。拡張用の API で足した部分は、既存のものの作者が想定した形で動き続ける。

## この skill が必要な理由と達成したい状態

この skill が必要な理由は、AI にとって探すより書くほうが速いことにある。AI は探さなくても、知っている範囲で書けてしまう。ところが AI の知識は学習した時点で止まっている。その後に出たパッケージも、検索結果の要約に出てこなかったパッケージも知らない。だから既存のものがあっても、無いものとして自作を始める。自作したものの保守は、作った側が背負う。既存のものなら、その保守は作者が担っていた。さらに、自作したものの不具合や考え漏れは、1 つの AI や 1 人の人間が指摘できる範囲を超えることが多い。既存のものの不具合は、多くの利用者が使う中で見つかり、直されてきている。

この skill で達成したい状態は、リポジトリにあるコードが、既存のものでは足りない部分だけでできていることである。

## よくある場面では決まったものを使う

次の場面では、挙げたものを使う。

- 配列、オブジェクト、文字列のユーティリティ（`groupBy`、`chunk`、`debounce`、deep merge、深い等価比較）: `es-toolkit`
- 外から入ってくる値の解析と検証（URL、メールアドレス、日付の文字列、JSONの形）: `Schema`
- 環境変数や設定値の読み込み: `Config`
- 秘密の値を持ち回り、ログに出さないようにする: `Redacted`
- 日付、時刻、タイムゾーン、期間の計算と整形: `DateTime`、`Duration`
- リトライとバックオフ: `Effect.retry` と `Schedule.exponential`、`Schedule.jittered`
- cron式の解析と次の実行時刻: `Cron`
- base64やhexのエンコードとデコード: `Encoding`
- UUID、乱数、ランダムな文字列: `crypto.randomUUID`、`Random`、`Encoding.randomHex`
- ハッシュ、署名、暗号化: `crypto.subtle`
- 同時実行数の制限、ロック、キュー、キャッシュ: `Semaphore`、`Queue`、`Cache`
- 値の形による分岐: `Match`
- YAMLの読み書き: `yaml`
- Markdownの解析と変換: `remark`
- シェルに渡す文字列のエスケープ: `shell-quote`
- CLIの引数とサブコマンドの解析: `citty`
- 外部HTTPのモック: `msw`
- 外部APIやSaaSをEffectから呼ぶクライアント: `@distilled.cloud/<サービス名>` に生成済みのSDKがあればそれを使う。無ければ、公開されているOpenAPIから `@effect/openapi-generator` の `openapigen` で生成する
- SQLの組み立てとマイグレーション: `drizzle-orm`
- 認証、セッション、パスキー、APIキー: `better-auth`
- TOTP: `otpauth`
- サーバーから取ってきたデータの取得とキャッシュ: `@tanstack/react-query`
- フォームの状態と入力チェック: `@tanstack/react-form`
- テーブルの並べ替え、絞り込み、ページ送り: `@tanstack/react-table`
- 長いリストの仮想スクロール: `@tanstack/react-virtual`
- Reactでのdebounce、throttle、rate limit: `@tanstack/react-pacer`

## 用途

上の一覧に無い場面では、次も読むこと。

- [`find-existing`](usecases/find-existing.md)。既存のものを探して選ぶ
