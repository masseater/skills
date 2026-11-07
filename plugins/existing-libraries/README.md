# existing-libraries

新しい処理を書き始める前に、使えるライブラリが Claude の目に入るようにするプラグインである。[dont-it-yourself](../../skills/dont-it-yourself/SKILL.md) は探す手順を書いているが、探すかどうかは Claude に任される。このプラグインは hook で一覧そのものを文脈に入れる。

- `SessionStart` hook が、npm の maintainer `r_masseater` のパッケージを npm registry の検索 API から読み、名前と説明と最後に出した日を文脈に入れる。まだ依存に入れていないパッケージも見える
- `PreToolUse` hook が、セッションの中でリポジトリのファイルを初めて書き換える前に 1 度だけ編集を止め、そのリポジトリの `intent list` が返す [TanStack Intent](https://github.com/TanStack/intent) の skill の一覧を返す。Claude は合う skill を読んでから編集をやり直す

リポジトリ自身の `.claude/settings.json` に Intent の hook があっても、claude.ai のプロジェクトのスレッドのように作業ディレクトリがリポジトリの外にあるセッションでは動かない。`PreToolUse` hook はこのときだけ動き、`CLAUDE_PROJECT_DIR` がそのリポジトリのときは何もしない。

hook は Node.js 22.18 以降で TypeScript をそのまま動かす。npm registry へは `--use-env-proxy` で `HTTPS_PROXY` を通る。

```sh
/plugin marketplace add masseater/skills
/plugin install existing-libraries@masseater
```
