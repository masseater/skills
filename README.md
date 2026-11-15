# skills

masseater のリポジトリで AI エージェントに守らせる書き方と作り方を、[Agent Skills](https://agentskills.io) にまとめたものである。
Claude Code にはプラグインとして、ほかのエージェントには skills CLI でインストールできる。

## スキル

<!-- skills:start -->

- [build-explanation](plugins/masseater-skills/skills/build-explanation/SKILL.md): 読み手が既知の情報を起点とし、次に問われる質問に答える順序で展開する解説を、読み手向けに作成するための手順書。スライドの構成やスピーカースクリプト、および解説、提案書、報告書の本文を作成する際に活用する。
- [cloudflare-caution](plugins/masseater-skills/skills/cloudflare-caution/SKILL.md): Cloudflareの料金を吊り上げるような設計は避け、コストを抑えた形式を選択しよう。Cloudflareにデプロイするものを設計する際、Workerやバインディングを追加する際、ページやデータの提供方法を決定する際、そしてループやリトライを記述する際に活用してほしい。
- [create-slides](plugins/masseater-skills/skills/create-slides/SKILL.md): スライドを作成する前に、聴衆や場面に応じたデフォルト設定と聴衆からの質問に基づいて作成した構成案を提示し、作成後にプレゼンテーションの流れを確認するためのスピーカースクリプトを記述する手順。スライドやプレゼンテーション資料の作成を依頼された際に使用する。
- [debug-like-a-human](plugins/masseater-skills/skills/debug-like-a-human/SKILL.md): AIはオーナーと同じ認証パスを通じて、ログイン後の画面やAccessの本番環境にアクセスし、自ら確認を行う。ログインを伴う画面やAPI、サイトの構築時、本番環境のバグ調査時、および「オーナーの認証が必要なため確認できない」と書きかけの際などに活用する。
- [desktop-app-quality](plugins/masseater-skills/skills/desktop-app-quality/SKILL.md): デスクトップアプリの設計、開発、レビューをするときに読む。各 OS への適合、日本語入力、作業を失わないことなど、ユーザーがアプリに触れたときに感じる品質の基準を決める。
- [dont-it-yourself](plugins/masseater-skills/skills/dont-it-yourself/SKILL.md): ライブラリ、ランタイム、リポジトリに既に存在するものを探し出して利用し、自作はしない。新規の処理、ヘルパー、ラッパー、ツール、または外部API用のクライアントを記述し始める前に、まずはこれらを利用すること。
- [how-to-use-react](plugins/masseater-skills/skills/how-to-use-react/SKILL.md): React 19.3のコンポーネント、ローダー、およびサーバー処理の記述、修正、レビュー時に参照する。ステートの配置場所、非同期処理の構成方法、並行UI APIの使用箇所、およびpropsの形式を決定する。
- [humanity-and-humanness](plugins/masseater-skills/skills/humanity-and-humanness/SKILL.md): AIが人間の読み方、考え方、感覚を前提として持つように読む。人間が読む文章を書く際、ユーザーに判断を求める際、ユーザーのフィードバックの意図を読み取る際に活用する。
- [integrate](plugins/masseater-skills/skills/integrate/SKILL.md): ライブラリや新しい実装手段を導入する際に使用する。追加するだけで終わらせず、既存のコードを移行し、その手段の使用を機械的に強制するところまで行う。
- [masseater-ecosystem](plugins/masseater-skills/skills/masseater-ecosystem/SKILL.md): masseaterのテックスタックの完成形と、自社開発のものと借用したものの境界。技術やサービスを選択する際、自前で開発するか既存のものを利用するかを判断する際、新しい言語やフォーマット、配布先を追加する際、そしてリポジトリの構造を変更する際に参照すること。
- [measure-dont-guess](plugins/masseater-skills/skills/measure-dont-guess/SKILL.md): 実装や修正を行う前に、仮説をどちらに収束させるかを判断し、実行した上で、その結果のみで判断する。バグの原因を調査する際、パフォーマンスや行動を比較する際、新機能の開発に着手する際、そして「おそらく」と判断しようとする際に活用する。
- [measure-everything](plugins/masseater-skills/skills/measure-everything/SKILL.md): 何かを構築または修正する前に、どのように測定するかを決めておく。トレース、メトリクス、ログを追加する際、テレメトリが実際にプロセスから抜けているかを確認する際、Web Vitalsやページ遷移を測定する際、CIのタイミングを調整する際、あるいはカスタム測定コードを記述しようとする際などに活用する。
- [measure-postmortem](plugins/masseater-skills/skills/measure-postmortem/SKILL.md): PRを読み、その修正が事前に計測されていれば防げた、あるいは検出できたのではないかと検討する。バグを修正したPRを振り返る際や、計測の漏れを探す際に活用する。
- [project-checklist](plugins/masseater-skills/skills/project-checklist/SKILL.md): プロジェクトの設計で考慮すべき項目が満たされているか、実機を確認することで判断する。masseater/typescript-template から作成したリポジトリについては、GitHub の設定やテンプレートへの移行についても網羅する。新規リポジトリの作成時、AI への移行を完了した後、大幅な変更を行う前、および既存プロジェクトのレビュー時に活用する。
- [repo-conventions](plugins/masseater-skills/skills/repo-conventions/SKILL.md): masseaterのリポジトリに共通するルール。masseater/typescript-templateから作成されたリポジトリ、またはAGENTS.mdでこのスキルが参照されているリポジトリで作業を開始する際に参照すること。
- [simplify-repo](plugins/masseater-skills/skills/simplify-repo/SKILL.md): リポジトリ全体を簡素化する。
- [skill-authoring](plugins/masseater-skills/skills/skill-authoring/SKILL.md): Agent Skillsスキル（すなわち `SKILL.md` とそのディレクトリ）の作成、修正、または訂正時に読み込む。ボディは、なぜそのスキルが必要なのか、どのような状態を実現すべきかを導出して記述し、修正時には改めて全体を導出する。
- [vite-plus](plugins/masseater-skills/skills/vite-plus/SKILL.md): Vite+ の `vp` でインストール、実行、確認、テストを行う。`vite-plus` を使用するリポジトリでコマンドを実行する際、タスクやチェックを追加する際、および生成されたコマンドを翻訳する際に使用する。
- [writing](plugins/masseater-skills/skills/writing/SKILL.md): 文章の執筆や修正時に読む。ドキュメント、コメント、コミットメッセージ、PR本体、README、masseater名義で公開された記事、小説などを扱う。また、「AIっぽい」「冗長」「読みづらい」と評された文章を修正する際や、Claudeにアイデアをぶつけた後に「記事にしてほしい」と頼まれた際にも利用する。

<!-- skills:end -->

## プラグイン

### plamo-ja

Claude に英語で書かせ、ローカルの [PLaMo 3 Translate](https://huggingface.co/pfnet/plamo-3-translate-0.8b-GGUF) で訳した日本語を画面に出す。transcript と Claude の文脈は英語のまま残る。

```sh
hf download pfnet/plamo-3-translate-0.8b-GGUF plamo-3-translate-0.8b-Q4_K_M.gguf chat_template.jinja --local-dir plamo-3-translate-0.8b-GGUF
cd plamo-3-translate-0.8b-GGUF
llama-server -m plamo-3-translate-0.8b-Q4_K_M.gguf -c 16384 --port 8000 --alias plamo-3-translate --chat-template-file chat_template.jinja --no-prefill-assistant
```

`/plugin install plamo-ja@masseater` で入れ、`/plamo-ja:display` でオン、`/plamo-ja:display off` でオフにする。`PLAMO_JA_AUTO=on` で全セッションを既定でオンにし、`PLAMO_JA_SERVER_COMMAND` に置いたコマンドでセッションの開始時にサーバーを起動する。接続先、文体、訳語の指定は [display skill](plugins/plamo-ja/skills/display/SKILL.md) にある。

発想は kat0h の [X のポスト](https://x.com/kat0h/status/2118175639262175376)と [gist の plamo-ja-v2 skill](https://gist.github.com/kat0h/61951d19c606374aa1dd901b0303cc6c)（2026-11-05）による。gist にはライセンスの表記が無いので、コードは写さずに書き直した。モデルは同梱せず、利用者が [PLaMo Community License](https://plamo.preferredai.jp/info/plamo-community-license-ja) に従って取得する。

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
