# モデルの呼び出し

- APIキーが必要なすべてのモデル呼び出しをCloudflare AI Gateway経由で送信する。Workerの外では、Workers AI Read権限を持つCloudflare APIトークンを使用して、`https://api.cloudflare.com/client/v4/accounts/<account>/ai/v1/chat/completions` のREST APIを呼び出し、`cf-aig-gateway-id` ヘッダーでゲートウェイを指定する。Workerの内部では、`gateway` オプションを指定してAIバインディングを使用する。
- リポジトリ内でOpenRouterや個別のモデルプロバイダーのAPIキーを使用しないこと。ゲートウェイを1つにまとめれば、ログ、キャッシュ、レート制限、課金を一箇所で管理でき、さらにクレデンシャルブローカーがCIにCloudflareトークンをすでに渡している。
- Workers AIモデル（`@cf/...`）を優先する。アカウント上のWorkers AIの利用分として請求される。サードパーティ製モデルにはUnified Billingのクレジットが必要であり、クレジットはオーナーの承認がある場合にのみ購入する。
- ゲートウェイはダッシュボードではなく、Alchemyスタック内で `AI.Gateway` として管理する。公開するライブラリは利用者のために他のプロバイダーへの対応を残してよいが、リポジトリ自体はそれを利用しない。オーナーの長期トークンを利用するClaude Agent SDK経由のClaudeはAPIキーを必要としないため、このルールは適用されない。
