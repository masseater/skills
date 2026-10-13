# skills

masseater のリポジトリで共通に使うエージェントスキル。

## Claude Code プラグインとして入れる

このリポジトリは Claude Code のプラグインマーケットプレイスを兼ねる。

```sh
/plugin marketplace add masseater/skills
/plugin install masseater-skills@masseater
```

CLI から入れる場合:

```sh
claude plugin marketplace add masseater/skills
claude plugin install masseater-skills@masseater
```

プロジェクトで常に有効にするなら `.claude/settings.json` に書く:

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

[skills CLI](https://github.com/vercel-labs/skills) でも入れられる。

```sh
npx skills add masseater/skills
```
