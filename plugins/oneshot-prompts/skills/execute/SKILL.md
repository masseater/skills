---
name: execute
description: 置き場のプロンプトを、選んだモデル（haiku、sonnet、opus、fable）で claude -p に 1 回流して結果を見る。
argument-hint: "<id> [haiku|sonnet|opus|fable]"
disable-model-invocation: true
allowed-tools: Bash(node ${CLAUDE_SKILL_DIR}/scripts/run.ts *)
---

# execute

引数: `$ARGUMENTS`

1. 1 つ目の引数を ID とする。無ければ、ユーザーに ID を尋ねる
2. 2 つ目の引数にモデルが無ければ、AskUserQuestion で「どのモデルで実行するか」を、haiku、sonnet、opus、fable から選んでもらう。どれかを勧めない。モデルによって結果が違うのを見るために実行するので、選ぶのはユーザーである
3. 次のコマンドを 1 回実行し、出力をそのままユーザーに伝える

```bash
node ${CLAUDE_SKILL_DIR}/scripts/run.ts --model <haiku|sonnet|opus|fable> <id>
```

- スクリプトはプロンプトの本文を標準入力から `claude -p --model <モデル>` に渡す
- 終了コードが 0 でなければ、標準エラーの内容を伝える。別のモデルで自動で再実行しない
