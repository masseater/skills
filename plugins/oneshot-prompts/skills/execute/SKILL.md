---
name: execute
description: 置き場のプロンプトを、選んだモデル（haiku、sonnet、opus、fable、mythos）で claude -p に 1 回流して結果を見る。
argument-hint: "<id> [haiku|sonnet|opus|fable|mythos]"
disable-model-invocation: true
allowed-tools: Bash(node ${CLAUDE_SKILL_DIR}/scripts/run.ts *)
---

# execute

引数: `$ARGUMENTS`

1. 1 つ目の引数を ID とする。無ければ、ユーザーに ID を尋ねる
2. 2 つ目の引数にモデルが無ければ、AskUserQuestion で「どのモデルで実行するか」を、haiku、sonnet、opus、fable、mythos から選んでもらう。どれかを勧めない。モデルによって結果が違うのを見るために実行するので、選ぶのはユーザーである
3. 次のコマンドを 1 回実行し、出力をそのままユーザーに伝える

```bash
node ${CLAUDE_SKILL_DIR}/scripts/run.ts --model <haiku|sonnet|opus|fable> <id>
```

- スクリプトはプロンプトの本文を標準入力から `claude -p --model <モデル>` に渡す。`mythos` は `claude` が別名として認識しないので、`claude-mythos-5-2` に置き換えて渡す。承認された組織でないと使えない
- ユーザーが effort（low、medium、high、xhigh、max）を指定したときだけ、`--effort <effort>` を付ける。指定が無ければ付けない
- 常に `--tools Bash,Write,Edit,Read --strict-mcp-config --disable-slash-commands --setting-sources project` を付ける。`claude -p` の組み込みツールを Bash、Write、Edit、Read だけにし、MCP、スキル、ユーザー設定を外す。Artifact ツールやユーザーのデザインシステムなど、実行環境にある物が結果に混ざるのを防ぐ。`--bare` はサブスクリプションの認証で使えないので使わない
- ユーザーが権限モード（default、acceptEdits、plan、auto、dontAsk、bypassPermissions）を指定したときだけ、`--permission-mode <モード>` を付ける。指定が無ければ付けない
- 終了コードが 0 でなければ、標準エラーの内容を伝える。別のモデルで自動で再実行しない
