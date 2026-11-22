# skills

masseater のリポジトリで AI エージェントに守らせる書き方と作り方を、[Agent Skills](https://agentskills.io) にまとめたものである。
Claude Code にはプラグインとして、ほかのエージェントには skills CLI でインストールできる。

各プラグインの説明は、[plugins](plugins) の下にあるそれぞれのディレクトリの README.md にある。

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
