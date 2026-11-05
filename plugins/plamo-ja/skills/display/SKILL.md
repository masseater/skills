---
name: display
description: 日本語表示モードを切り替える。オンの間、Claude は英語で書き、hook がローカルの PLaMo 3 Translate で訳した日本語を画面に出す。transcript と Claude の文脈は英語のまま残る。
argument-hint: "[on|off|reset|status]"
disable-model-invocation: true
allowed-tools: Bash(node ${CLAUDE_SKILL_DIR}/scripts/plamo-ja.ts *)
---

# 日本語表示モード

引数: `$ARGUMENTS`（空なら `on`）

次のコマンドを引数を付けて 1 回実行し、出力をユーザーに伝える。

```bash
node ${CLAUDE_SKILL_DIR}/scripts/plamo-ja.ts <on|off|reset|status> --session ${CLAUDE_SESSION_ID} --data ${CLAUDE_PLUGIN_DATA}
```

- `on`: モードをオンにし、PLaMo のサーバーが応答するかを確かめる。応答しなければ起動コマンドが出るので、そのまま見せる
- `off`: モードをオフにする。以後は下の決まりに従わず、普段どおり日本語で書く
- `reset`: このセッションの訳の履歴を消す。訳語が崩れたときに使う
- `status`: モードとサーバーの状態を出す

## オンの間の決まり

hook が訳すのは画面に出る応答の本文だけなので、次のように書く。

1. ユーザーに向けた文章は途中経過も最終報告もすべて英語で書く。日本語を自分で書いたり、翻訳のコマンドを実行したりしない。hook が段落ごとに訳す
2. 小型の翻訳モデルが訳しやすいよう、主語と述語のそろった平易な文で書き、慣用句や体言止めを避ける。ストリームの途中で届いた行もすぐに訳されるので、1 行を完結した文か箇条書きの 1 項目にし、段落は空行で区切る
3. コード、コマンド、パス、識別子はバッククォートかコードフェンスに入れる。フェンスの中と表は訳されずにそのまま出る
4. ユーザーは日本語で書く。そのまま読む
5. AskUserQuestion などツールの画面は hook の対象外である。AskUserQuestion を呼ぶ前に、質問と選択肢を次のコマンドで訳し、出力の日本語を使う

```bash
node ${CLAUDE_SKILL_DIR}/scripts/plamo-ja.ts translate --session ${CLAUDE_SESSION_ID} --data ${CLAUDE_PLUGIN_DATA} <<'PLAMO_EOF'
<English text>
PLAMO_EOF
```

## 設定

- `PLAMO_JA_URL`: llama-server の URL。既定は `http://127.0.0.1:8000`
- `PLAMO_JA_FORM`: `plain`（である調）か `polite`（です・ます調）
- `PLAMO_JA_HISTORY_BUDGET`: 訳の履歴として渡す文字数の上限。既定は 8000
- `${CLAUDE_PLUGIN_DATA}/glossary.json`: `[{"source": "hook", "target": "フック"}]` の形の訳語の指定
