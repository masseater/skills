# watashi

[watashi](https://watashi.masseater.dev)（持ち主の個人データを扱う MCP サーバー）の CLI と、Claude Code の会話履歴を送る Stop フックのプラグインである。会話は手元で [Betterleaks](https://github.com/betterleaks/betterleaks) を通して秘密を `[REDACTED:<規則>]` に伏せてから送るので、生の秘密は手元から出ない。受け手の仕組みと残課題は masseater.dev の [`apps/watashi-mcp/docs/conversations.md`](https://github.com/masseater/masseater.dev/blob/main/apps/watashi-mcp/docs/conversations.md) にある。

## 使い方

```sh
/plugin marketplace add masseater/skills
/plugin install watashi@masseater
```

入れると、Stop のたびに `watashi hook stop` が非同期に動き、前回から増えた行を送る。送るのは環境変数 `WATASHI_SEND_CONVERSATIONS=1` を置いた環境だけで、既定では送らない。仕事の環境のように送ってはいけない場所では置かない。認証が無いときも何もしない。失敗は `~/.config/watashi/hook.log` に書き、Claude Code の動きは止めない。

- 手元の PC では `node <プラグイン>/lib/main.ts login`（以下 `watashi` と書く）で OAuth を通す。
- クラウドのセッションでは、`watashi token issue --scope conversation:write --label cloud` で発行したトークンを、クラウド環境の環境変数 `WATASHI_TOKEN` に入れる。`watashi token list` と `watashi token revoke <id>` で管理する。

Betterleaks は `lib/betterleaks.ts` の `BETTERLEAKS_VERSION` の版を `mise exec` で動かす。mise が無いときは PATH の `betterleaks`、`WATASHI_BETTERLEAKS` で別のパスを渡せる。どれも無ければ送らない。

ほかのコマンドは次のとおりである。

```sh
watashi conversation push --kind claude-code --session <ID> [--cwd <dir>] <transcript.jsonl>
watashi mask < transcript.jsonl   # 伏せた結果を標準出力に出す
watashi logout
```

`WATASHI_URL` で送り先を、`WATASHI_HOME` で状態の置き場を変えられる。hook は Node.js 22.18 以降で TypeScript をそのまま動かす。

## テスト

`tests/mask.test.ts` は 15 種の偽の秘密を 5 通りの埋め込み方で入れ、送る本文に 1 つも残らないことを本物の Betterleaks で確かめる。偽の秘密はテストの実行時に作る。
