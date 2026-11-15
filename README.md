# skills

masseater のリポジトリで AI エージェントに守らせる書き方と作り方を、[Agent Skills](https://agentskills.io) にまとめたものである。
Claude Code にはプラグインとして、ほかのエージェントには skills CLI でインストールできる。

## スキル

<!-- skills:start -->

- [build-explanation](plugins/masseater-skills/skills/build-explanation/SKILL.md): 読み手が既知の情報を起点とし、次に問われる質問に答える順序で展開する解説を、読み手向けに作成するための手順書。
- [cloudflare-caution](plugins/masseater-skills/skills/cloudflare-caution/SKILL.md): Cloudflareの料金を吊り上げるような設計は避け、コストを抑えた形式を選択しよう。
- [create-slides](plugins/masseater-skills/skills/create-slides/SKILL.md): スライドを作成する前に、聴衆や場面に応じたデフォルト設定と聴衆からの質問に基づいて作成した構成案を提示し、作成後にプレゼンテーションの流れを確認するためのスピーカースクリプトを記述する手順。
- [debug-like-a-human](plugins/masseater-skills/skills/debug-like-a-human/SKILL.md): AIはオーナーと同じ認証パスを通じて、ログイン後の画面やAccessの本番環境にアクセスし、自ら確認を行う。
- [desktop-app-quality](plugins/masseater-skills/skills/desktop-app-quality/SKILL.md): デスクトップアプリの設計、開発、レビューをするときに読む。
- [find-before-build](plugins/masseater-skills/skills/find-before-build/SKILL.md): ライブラリ、ランタイム、リポジトリに既に存在するものを探し出して利用し、自作はしない。
- [how-to-use-react](plugins/masseater-skills/skills/how-to-use-react/SKILL.md): React 19.3のコンポーネント、ローダー、およびサーバー処理の記述、修正、レビュー時に参照する。
- [humanity-and-humanness](plugins/masseater-skills/skills/humanity-and-humanness/SKILL.md): AIが人間の読み方、考え方、感覚を前提として持つように読む。
- [integrate](plugins/masseater-skills/skills/integrate/SKILL.md): ライブラリや新しい実装手段を導入する際に使用する。
- [masseater-ecosystem](plugins/masseater-skills/skills/masseater-ecosystem/SKILL.md): masseaterのリポジトリで作業する際のエントリーポイント。
- [measure-dont-guess](plugins/masseater-skills/skills/measure-dont-guess/SKILL.md): 実装や修正を行う前に、仮説をどちらに収束させるかを判断し、実行した上で、その結果のみで判断する。
- [measure-everything](plugins/masseater-skills/skills/measure-everything/SKILL.md): 何かを構築または修正する前に、どのように測定するかを決めておく。
- [measure-postmortem](plugins/masseater-skills/skills/measure-postmortem/SKILL.md): PRを読み、その修正が事前に計測されていれば防げた、あるいは検出できたのではないかと検討する。
- [project-checklist](plugins/masseater-skills/skills/project-checklist/SKILL.md): プロジェクトの設計で考慮すべき項目が満たされているか、実機を確認することで判断する。
- [repo-conventions](plugins/masseater-skills/skills/repo-conventions/SKILL.md): masseaterのリポジトリに共通するルール。
- [simplify-repo](plugins/masseater-skills/skills/simplify-repo/SKILL.md): リポジトリ全体を簡素化する。
- [skill-authoring](plugins/masseater-skills/skills/skill-authoring/SKILL.md): Agent Skillsスキル（すなわち `SKILL.md` とそのディレクトリ）の作成、修正、または訂正時に読み込む。
- [vite-plus](plugins/masseater-skills/skills/vite-plus/SKILL.md): Vite+ の `vp` でインストール、実行、確認、テストを行う。
- [writing](plugins/masseater-skills/skills/writing/SKILL.md): 文章の執筆や修正時に読む。

<!-- skills:end -->

## プラグイン

### plamo-ja

Claude に英語で書かせ、ローカルの [PLaMo 3 Translate](https://huggingface.co/pfnet/plamo-3-translate-0.8b-GGUF) で訳した日本語を画面に出す。transcript と Claude の文脈は英語のまま残る。

Linux x64およびmacOS arm64では、セッション開始フックがllama-serverとモデルの固定バージョンをダウンロードし、サーバーを起動するため、手動でインストールする必要はない。その他のプラットフォームでは、llama-serverを自身で起動すること。

`/plugin install plamo-ja@masseater` でインストールする。`/plamo-ja:display` で有効化し、`/plamo-ja:display off` で無効化する。設定は [display skill](plugins/plamo-ja/skills/display/SKILL.md) にある。

発想は kat0h の [X のポスト](https://x.com/kat0h/status/2118175639262175376)と [gist の plamo-ja-v2 skill](https://gist.github.com/kat0h/61951d19c606374aa1dd901b0303cc6c)（2026-11-05）による。gist にはライセンスの表記が無いので、コードは写さずに書き直した。プラグインはモデルをバンドルしていない。フックはHugging Faceからダウンロードし、ユーザーは[PLaMo Community License](https://plamo.preferredai.jp/info/plamo-community-license-ja)に従う。

### watashi

Claude Code の会話履歴を、手元の [Betterleaks](https://github.com/betterleaks/betterleaks) で秘密を `[REDACTED:<規則>]` に伏せてから、Stop フックで [watashi](https://watashi.masseater.dev) に送る。環境変数 `WATASHI_SEND_CONVERSATIONS=1` を置いた環境でだけ送る。実体は npm の [`@r_masseater/watashi`](https://www.npmjs.com/package/@r_masseater/watashi) で、ソースは [masseater/masseater.dev の libs/watashi](https://github.com/masseater/masseater.dev/tree/main/libs/watashi) にある。

```sh
/plugin install watashi@masseater
npx @r_masseater/watashi login                                                  # 手元の PC
npx @r_masseater/watashi token issue --scope conversation:write --label cloud   # クラウド用。WATASHI_TOKEN に入れる
```

## Claude Code にインストール

```sh
/plugin marketplace add masseater/skills
/plugin install masseater-skills@masseater
```

### チームで使う

`.claude/settings.json`

```json
{
  "extraKnownMarketplaces": {
    "masseater": {
      "source": { "source": "github", "repo": "masseater/skills" }
    }
  },
  "enabledPlugins": {
    "masseater-skills@masseater": true
  }
}
```

## skills CLI でインストール

```sh
npx skills add masseater/skills
```
