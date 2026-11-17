---
name: translate
description: 英語で書いた文書をローカルの PLaMo 3 Translate で日本語に訳す。英語で書いてから PLaMo で訳す決まりの文書（資料・記事・README など）を訳すときに使う。
argument-hint: "<input.md> [--out <output.md>]"
allowed-tools: Bash(node ${CLAUDE_SKILL_DIR}/scripts/translate.ts *)
---

# translate

訳す処理はセッションの中のマシンで閉じる。ホスティングした翻訳サーバーには頼らず、表示モードと同じローカルの llama-server を使う。

```bash
node ${CLAUDE_SKILL_DIR}/scripts/translate.ts <input.md> --out <output.md> --data ${CLAUDE_PLUGIN_DATA}
```

- Markdown の構造（見出し、箇条書き、引用、表、コードフェンス）を保ち、段落や項目ごとに訳す。フェンスと表はそのまま残る
- サーバーが応答しなければ、表示モードと同じく `PLAMO_JA_SERVER_COMMAND` か同梱のサーバーを起動して最大 60 秒待つ
- 訳せなかった行は英語のまま残り、標準エラーに `untranslated:` として出て、終了コードが 3 になる。その行だけ自分で日本語にする
- 文体は `PLAMO_JA_FORM` が無ければ、である調で訳す
- `${CLAUDE_PLUGIN_DATA}/glossary.json` の訳語の指定が効く
