# skills

AI エージェントに masseater の書き方と進め方を持たせるスキル集である。文章の推敲、計測してから判断する進め方、自前で作らずにライブラリを探す判断のような、どのリポジトリでも同じにしたい基準を、リポジトリごとに書き直さずに入れられる。

Claude Code のプラグインとしても、[skills CLI](https://github.com/vercel-labs/skills) でも入れられる。入っているスキルとその用途は [skills/](skills/) の各 `SKILL.md` の冒頭にある。

## Claude Code に入れる

Claude Code の中で次を実行する。

```sh
/plugin marketplace add masseater/skills
/plugin install masseater-skills@masseater
```

ターミナルから入れるときは次を実行する。

```sh
claude plugin marketplace add masseater/skills
claude plugin install masseater-skills@masseater
```

`claude plugin details masseater-skills@masseater` にスキルが並べば入っている。

プロジェクトの全員に同じスキルを使わせるときは、そのリポジトリの `.claude/settings.json` に書く。

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

## skills CLI で入れる

Claude Code 以外のエージェントで使うときは、Node.js のある環境で次を実行する。

```sh
npx skills add masseater/skills
```

`npx skills list` にスキルが並べば入っている。
