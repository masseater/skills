# AGENTS.md

masseater のリポジトリで共通に使うエージェントスキルを置くリポジトリである。Claude Code のプラグインマーケットプレイスを兼ね、`.claude-plugin/plugin.json` が `skills/` をそのままプラグインの skill にしている。

- skill を作る、直すときは `skills/skill-authoring/SKILL.md` に従う
- 文章は `skills/writing/SKILL.md` に、読み手である人間の前提は `skills/humanity-and-humanness/SKILL.md` に従う
- ドキュメント、コミットメッセージ、PR 本文は日本語で書く

## 構成

skill は `skills/<name>/` に 1 つずつ置き、`name` はディレクトリ名と同じにする。1 つの文書には 1 つの種類だけを入れる。

- `SKILL.md` には、必要な理由と達成したい状態の説明と、規則を置く
- `usecases/` には手順を置く
- `references/` には、特定のリポジトリや環境に固有の参照と、規則の詳細を置く

`metadata.derived-from` には、内容を取り込んで読み替えた原典の URL だけを、コミットを指定した permalink で書く。読んだだけの資料や根拠として引く資料は、本文にリンクする。

## コマンド

```sh
npx -y skills-ref validate skills/<name>   # frontmatter と構成を検証する
npx skills init <name>                      # SKILL.md の雛形を作る
```

README.md の「入っているスキル」の一覧は、main に push されると `.github/workflows/readme.yml` が `node scripts/update-readme.mjs` で各 `SKILL.md` の `name` と `description` から書き直す。手で直さない。手元で揃えるときも同じコマンドを動かし、`--check` を付けると古いときに失敗する。

ビルド、テスト、lint はない。skill を変えたら `skills-ref validate` を通し、参照するファイルと名前で委ねた skill が存在することを確かめる。

## 作業の流れ

ブランチを切って PR を出し、squash でマージする。mergify は使わない。マージ後はブランチを main から作り直す。
