# plamo-ja

Claude Code の応答を、ローカルで動かす翻訳モデル [PLaMo 3 Translate](https://huggingface.co/pfnet/plamo-3-translate-0.8b-GGUF) で日本語にして画面に出すプラグインである。オンにすると Claude は英語で書き、`MessageDisplay` hook が段落ごとに訳す。AskUserQuestion と、Claude の claude.ai のプロジェクトでスレッドに送るメッセージ（`mcp__hearthbot__post_message` など）は、`PreToolUse` hook が送る前に訳す。transcript と Claude の文脈は英語のまま残る。

## 使い方

llama-server で PLaMo 3 Translate を起動しておく。起動例は[モデルの README](https://huggingface.co/pfnet/plamo-3-translate-0.8b-GGUF) にある。

```sh
hf download pfnet/plamo-3-translate-0.8b-GGUF plamo-3-translate-0.8b-Q4_K_M.gguf chat_template.jinja --local-dir plamo-3-translate-0.8b-GGUF
cd plamo-3-translate-0.8b-GGUF
llama-server -m plamo-3-translate-0.8b-Q4_K_M.gguf -c 16384 --port 8000 --alias plamo-3-translate --chat-template-file chat_template.jinja --no-prefill-assistant
```

プラグインを入れ、セッションの中で `/plamo-ja:display` を実行するとオンになる。`/plamo-ja:display off` で戻る。`PLAMO_JA_AUTO=on` で全セッションを既定でオンにでき、`PLAMO_JA_SERVER_COMMAND` に起動コマンドを置くとセッションの開始時にサーバーを起動する。hook は Node.js 22.18 以降で TypeScript をそのまま動かす。

```sh
/plugin marketplace add masseater/skills
/plugin install plamo-ja@masseater
```

接続先、文体、訳語の指定は [display skill](skills/display/SKILL.md) の「設定」にある。

## 実測

2026-11-05 に、llama.cpp（commit 3259ab6）の llama-server と Q4_K_M のモデルで、4 コアの x86-64（GPU なし）で hook を通した。見出しと 1 文の段落、箇条書き 2 項目とコードフェンス、1 文の段落の 3 バッチで、1 バッチの hook は 1.0〜1.6 秒だった。生成は 1 秒あたり約 41 トークンだった。

## 出典とライセンス

発想は kat0h の [X のポスト](https://x.com/kat0h/status/2118175639262175376)と、そこで公開された [gist の plamo-ja-v2 skill](https://gist.github.com/kat0h/61951d19c606374aa1dd901b0303cc6c)（2026-11-05）による。英語で書かせて `MessageDisplay` で訳す方式と、履歴が上限を超えたら半分まで一度に落としてプロンプトキャッシュを効かせる方式は、この gist から取った。gist にはライセンスの表記が無いので、コードは写さずに書き直した。

このプラグインのコードはリポジトリと同じ AGPL-3.0 である。モデルは同梱せず、PFN の [PLaMo Community License](https://plamo.preferredai.jp/info/plamo-community-license-ja) に従って利用者が取得する。
