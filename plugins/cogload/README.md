# cogload

Claude Code の持ち主が読む量、覚えておく量、手で打つ量を減らす。

- 作業報告を、ターンが終わった時点で開始状態、完了状態、確認事項だけの表示に描き直す。書いている途中は全文が流れる。確認事項は末尾に置き、入力欄の上にも出す。省いた行は「全文」ボタンで開ける。Claude 側の記録は元の文章のまま残る
- UI のファイルや HTML の資料を書く前に、対応するスキルを Claude に読ませる。読むまで編集を止める

## 使い方

`/plugin install cogload@masseater` でインストールする。

報告を短くする判定は、あなたが Claude Code に接続済みの masseater MCP ポータルの `sundries` の `decide` ツールが行う。Cloudflare のトークンも環境変数も要らず、認証はポータルへのログインだけで足りる。ポータルに接続していないときや呼び出しに失敗したときは、報告を元の文章のまま表示する。

`decide` は Cloudflare AI Gateway（`default`）経由で Clef Flash を呼ぶ。行を選ぶだけで、文章は書き換えない。

読ませるスキルを増やすには、`hooks/skill-first.ts` の `RULES` に、ファイルパスの条件とスキル名の組を足す。
