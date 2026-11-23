# cogload

Claude Code の持ち主が読む量、覚えておく量、手で打つ量を減らす。

- 作業報告を、開始状態、完了状態、確認事項だけにして表示する。確認事項は末尾に置き、入力欄の上にも出す。省いた行は「全文」ボタンで開ける。Claude 側の記録は元の文章のまま残る
- UI のファイルや HTML の資料を書く前に、対応するスキルを Claude に読ませる。読むまで編集を止める

## 使い方

`/plugin install cogload@masseater` でインストールする。

報告を短くするには、Workers AI Read 権限を持つ Cloudflare の API トークンが要る。環境変数 `CLOUDFLARE_ACCOUNT_ID` と `CLOUDFLARE_API_TOKEN` に設定する。設定が無いときは、報告を元の文章のまま表示する。

判定には Cloudflare AI Gateway（`default`）経由の Clef Flash を使う。行を選ぶだけで、文章は書き換えない。

読ませるスキルを増やすには、`hooks/skill-first.ts` の `RULES` に、ファイルパスの条件とスキル名の組を足す。
