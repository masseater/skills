# plamo-ja

Claude に英語で書かせ、ローカルの [PLaMo 3 Translate](https://huggingface.co/pfnet/plamo-3-translate-0.8b-GGUF) で訳した日本語を画面に出す。transcript と Claude の文脈は英語のまま残る。

Linux x64およびmacOS arm64では、セッション開始フックがllama-serverとモデルの固定バージョンをダウンロードし、サーバーを起動するため、手動でインストールする必要はない。その他のプラットフォームでは、llama-serverを自身で起動すること。

`/plugin install plamo-ja@masseater` でインストールする。`/plamo-ja:display` で有効化し、`/plamo-ja:display off` で無効化する。設定は [display skill](skills/display/SKILL.md) にある。

発想は kat0h の [X のポスト](https://x.com/kat0h/status/2118175639262175376)と [gist の plamo-ja-v2 skill](https://gist.github.com/kat0h/61951d19c606374aa1dd901b0303cc6c)（2026-11-05）による。gist にはライセンスの表記が無いので、コードは写さずに書き直した。プラグインはモデルをバンドルしていない。フックはHugging Faceからダウンロードし、ユーザーは[PLaMo Community License](https://plamo.preferredai.jp/info/plamo-community-license-ja)に従う。
