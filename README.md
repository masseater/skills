# skills

masseater のリポジトリで AI エージェントに守らせる書き方と作り方を、[Agent Skills](https://agentskills.io) にまとめたものである。
Claude Code にはプラグインとして、ほかのエージェントには skills CLI でインストールできる。

## スキル

<!-- skills:start -->

- [build-explanation](skills/build-explanation/SKILL.md): 人に何かを説明するときに、読み手が知っていることから始め、読み手が次に抱く疑問に答える順で話を組み立てる手順。スライドの構成と読み上げ原稿、解説、提案、報告の文章を組み立てるときに使う。
- [cloudflare-caution](skills/cloudflare-caution/SKILL.md): Cloudflare で請求が膨らむ設計を避け、安く済む形を選ぶ。Cloudflare に載せるものを設計するとき、Worker やバインディングを足すとき、ページやデータの配り方を決めるとき、ループや再試行を書くときに使う。
- [create-slides](skills/create-slides/SKILL.md): スライドを作る前に相手や場の既定値と、聞き手の問いから組んだ構成案を示し、作った後に読み上げ原稿を書いて発表の流れを確かめる手順。スライドや資料を作ってほしいと頼まれたときに使う。
- [dont-it-yourself](skills/dont-it-yourself/SKILL.md): ライブラリ、ランタイム、リポジトリにすでにあるものを探して使い、自前で作らない。新しい処理、ヘルパー、ラッパー、ツール、外部 API のクライアントを書き始める前に使う。
- [how-to-use-react](skills/how-to-use-react/SKILL.md): React 19.3 のコンポーネント、ローダー、サーバー処理を書く・直す・レビューするときに読む。状態の置き場所、非同期の組み方、並行 UI の API の使いどころ、props の形を決める。
- [humanity-and-humanness](skills/humanity-and-humanness/SKILL.md): 人間がどう読み、どう考え、何を察するかを AI が前提として持つために読む。人間が読む文章を書くとき、ユーザーの判断を仰ぐとき、ユーザーの指摘の意図を読み取るときに使う。
- [integrate](skills/integrate/SKILL.md): ライブラリや新しい実装手段を導入するときに使う。追加するだけで終わらせず、既存コードの移行と、その手段を使わせる機械的な強制まで行う。
- [measure-dont-guess](skills/measure-dont-guess/SKILL.md): 仮説を白黒つける計測を実装や修正の前に決めて実行し、その結果だけで判断する。不具合の原因を調べるとき、性能や挙動を比べるとき、新しい機能を書き始めるとき、「たぶん」で判断しそうになったときに使う。
- [project-checklist](skills/project-checklist/SKILL.md): プロジェクトの設計で検討すべき事項が充足しているかを、実物で確認して判定する。masseater/typescript-template から作ったリポジトリでは、GitHub の設定とテンプレートへの移行も扱う。新しいリポジトリの作成時、AI に移行を任せたあと、大きな変更の前、既存のプロジェクトの見直しで使う。
- [skill-authoring](skills/skill-authoring/SKILL.md): Agent Skills の skill、つまり `SKILL.md` とそのディレクトリを作る・直す・添削するときに読む。本文を skill が必要な理由と達成したい状態から導いて書き、直すときも全体を導き直す。
- [writing](skills/writing/SKILL.md): 文章を書く・推敲するときに読む。ドキュメント、コメント、コミットメッセージ、PR 本文、README、masseater の名前で出す記事、小説が対象である。「AI っぽい」「冗長」「読みにくい」と言われた文章を直すとき、Claude との壁打ちを「記事化して」と言われたときにも使う。

<!-- skills:end -->

## プラグイン

- [plamo-ja](plugins/plamo-ja/README.md): Claude に英語で書かせ、ローカルの PLaMo 3 Translate で訳した日本語を画面に出す。

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
