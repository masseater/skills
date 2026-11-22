# skills

masseater のリポジトリで使うエージェント向けのプラグインを配る、Claude Code のプラグインマーケットプレイスである。
各プラグインの説明は、[plugins](plugins) の下にあるそれぞれのディレクトリの README.md にある。

## Claude Code にインストール

```sh
/plugin marketplace add masseater/skills
/plugin install <プラグイン名>@masseater
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
    "<プラグイン名>@masseater": true
  }
}
```

## skills CLI でインストール

プラグインを使えないエージェントには、skills CLI でスキルをインストールできる。

```sh
npx skills add masseater/skills
```
