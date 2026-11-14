# TypeScriptテンプレートでの計測

## シグナルの出力方法

EffectのAPIでサーバーシグナルを出力し、Cloudflare WorkersのObservabilityに収集する方法。

- `apps/web/src/pages/home/api/tracing.server.ts` は `Effect.withSpan` を Workers のトレースにコピーする
- `Effect.log*` は Workers のログに出力される
- Cloudflare は D1 および fetch 呼び出しを自動的にスパン化する
- メトリクスには、Workers のリクエスト数、エラー数、CPU 時間および所要時間を使用する
- オブザーバビリティの設定とサンプリングレートは、`apps/web/alchemy.run.ts` の `observability` 内にある。

| 問題 | 出力するもの |
| ------- | ------------ |
| バグ | `Effect.logInfo` で入力と分岐を `Effect.annotateLogs` で出力し、`Effect.withSpan` でパスを確認し、テストで再現する |
| 低速化 | 変更前後の `Effect.withSpan` の所要時間を比較し、ロジックのみを `vp test bench` で比較する |
| 新機能 | 受入テストに加え、`Effect.annotateLogs` で成功・失敗をログに出力し、Workers のログでカウントする |

## サンプル

ログとトレースでは、一部のリクエストのみをサンプルとして保持する。

- サンプリングレートは計測時のみ引き上げ、その後は復元する
- 判定時に、サンプル数が十分かどうかも明示する

## どこでクエリするか

- `.mcp.json` の `cloudflare-observability` MCP サーバーで、本番ログ、トレース、メトリクスをクエリする
- `cloudflare-api` MCP サーバーで他の Cloudflare API を呼び出す
- どちらも Alchemy プロファイルの認証情報を使用する
- デプロイ済みの Worker のログをストリーミングするには、`apps/web` で `vp exec alchemy logs --tail` を使用する。
- Effect のログとブラウザコンソールは、`vp run dev` のターミナルにも表示される。

## ブラウザ

`vp dlx @playwright/cli` で実行し、`console`、`requests`、`snapshot` で観測する。クラウド環境では、`/opt/pw-browsers` の Chromium を `.playwright/cli.config.json` の `launchOptions.executablePath` に書き込む。

`alchemy dev` が `CredentialsUnavailable` で停止した場合は、テストとログで測定可能な処理を進める。ユーザーには画面が計測されていないことを伝える。
