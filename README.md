# skills

masseater のリポジトリで AI エージェントに守らせる書き方と作り方を、[Agent Skills](https://agentskills.io) にまとめたものである。
Claude Code にはプラグインとして、ほかのエージェントには skills CLI でインストールできる。

## スキル

<!-- skills:start -->

- [build-explanation](plugins/masseater-skills/skills/build-explanation/SKILL.md): 人に何かを説明するときに、読み手が知っていることから始め、読み手が次に抱く疑問に答える順で話を組み立てる手順。スライドの構成と読み上げ原稿、解説、提案、報告の文章を組み立てるときに使う。
- [cloudflare-caution](plugins/masseater-skills/skills/cloudflare-caution/SKILL.md): Cloudflare で請求が膨らむ設計を避け、安く済む形を選ぶ。Cloudflare に載せるものを設計するとき、Worker やバインディングを足すとき、ページやデータの配り方を決めるとき、ループや再試行を書くときに使う。
- [create-slides](plugins/masseater-skills/skills/create-slides/SKILL.md): スライドを作る前に相手や場の既定値と、聞き手の問いから組んだ構成案を示し、作った後に読み上げ原稿を書いて発表の流れを確かめる手順。スライドや資料を作ってほしいと頼まれたときに使う。
- [dont-it-yourself](plugins/masseater-skills/skills/dont-it-yourself/SKILL.md): ライブラリ、ランタイム、リポジトリにすでにあるものを探して使い、自前で作らない。新しい処理、ヘルパー、ラッパー、ツール、外部 API のクライアントを書き始める前に使う。
- [how-to-use-react](plugins/masseater-skills/skills/how-to-use-react/SKILL.md): React 19.3 のコンポーネント、ローダー、サーバー処理を書く・直す・レビューするときに読む。状態の置き場所、非同期の組み方、並行 UI の API の使いどころ、props の形を決める。
- [humanity-and-humanness](plugins/masseater-skills/skills/humanity-and-humanness/SKILL.md): 人間がどう読み、どう考え、何を察するかを AI が前提として持つために読む。人間が読む文章を書くとき、ユーザーの判断を仰ぐとき、ユーザーの指摘の意図を読み取るときに使う。
- [integrate](plugins/masseater-skills/skills/integrate/SKILL.md): ライブラリや新しい実装手段を導入するときに使う。追加するだけで終わらせず、既存コードの移行と、その手段を使わせる機械的な強制まで行う。
- [masseater-ecosystem](plugins/masseater-skills/skills/masseater-ecosystem/SKILL.md): masseater の技術スタックの完成形と、自作するものと借りるものの境目。技術やサービスを選ぶとき、自作するか既存のものを使うかを決めるとき、新しい言語・形式・配布先を足すとき、リポジトリの構成を変えるときに読む。
- [measure-dont-guess](plugins/masseater-skills/skills/measure-dont-guess/SKILL.md): 仮説を白黒つける計測を実装や修正の前に決めて実行し、その結果だけで判断する。不具合の原因を調べるとき、性能や挙動を比べるとき、新しい機能を書き始めるとき、「たぶん」で判断しそうになったときに使う。
- [measure-everything](plugins/masseater-skills/skills/measure-everything/SKILL.md): Decide how to measure before building or fixing something. Use when adding traces, metrics or logs, checking that telemetry really leaves the process, measuring Web Vitals or page transitions, timing CI, or when about to write custom measurement code.
- [measure-postmortem](plugins/masseater-skills/skills/measure-postmortem/SKILL.md): PR を読み、その修正は事前に計測できていれば防げたか、検出できたかを考える。不具合を直した PR を振り返るとき、計測の抜けを探すときに使う。
- [project-checklist](plugins/masseater-skills/skills/project-checklist/SKILL.md): プロジェクトの設計で検討すべき事項が充足しているかを、実物で確認して判定する。masseater/typescript-template から作ったリポジトリでは、GitHub の設定とテンプレートへの移行も扱う。新しいリポジトリの作成時、AI に移行を任せたあと、大きな変更の前、既存のプロジェクトの見直しで使う。
- [repo-conventions](plugins/masseater-skills/skills/repo-conventions/SKILL.md): masseater のリポジトリに共通の決まり。masseater/typescript-template から作ったリポジトリや、AGENTS.md がこの skill を指すリポジトリで作業を始めるときに読む。
- [simplify-repo](plugins/masseater-skills/skills/simplify-repo/SKILL.md): リポジトリ全体を単純にする。
- [skill-authoring](plugins/masseater-skills/skills/skill-authoring/SKILL.md): Agent Skills の skill、つまり `SKILL.md` とそのディレクトリを作る・直す・添削するときに読む。本文を skill が必要な理由と達成したい状態から導いて書き、直すときも全体を導き直す。
- [vite-plus](plugins/masseater-skills/skills/vite-plus/SKILL.md): Vite+ の `vp` でインストール、実行、検査、テストをする。`vite-plus` を使うリポジトリでコマンドを実行するとき、タスクや検査を足すとき、生成されたコマンドを読み替えるときに使う。
- [writing](plugins/masseater-skills/skills/writing/SKILL.md): 文章を書く・推敲するときに読む。ドキュメント、コメント、コミットメッセージ、PR 本文、README、masseater の名前で出す記事、小説が対象である。「AI っぽい」「冗長」「読みにくい」と言われた文章を直すとき、Claude との壁打ちを「記事化して」と言われたときにも使う。

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

Claude Code の会話履歴を、手元の [Betterleaks](https://github.com/betterleaks/betterleaks) で秘密を `[REDACTED:<規則>]` に伏せてから、Stop フックで [watashi](https://watashi.masseater.dev) に送る。環境変数 `WATASHI_SEND_CONVERSATIONS=1` を置いた環境でだけ送る。

```sh
/plugin install watashi@masseater
node <プラグイン>/lib/main.ts login                                          # 手元の PC
node <プラグイン>/lib/main.ts token issue --scope conversation:write --label cloud  # クラウド用。WATASHI_TOKEN に入れる
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
