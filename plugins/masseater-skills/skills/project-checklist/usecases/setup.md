# GitHub側の設定を揃える

対象リポジトリを `REPO=<owner>/<name>` とする。

## 1. アプリ名を変更する

`apps/web/app-name.ts` の `APP_NAME` は依然としてテンプレートの名前である。リポジトリ名に合わせて変更する。同じ Cloudflare アカウント内の別のリポジトリと名前が衝突した場合、互いのリソースを置き換える。

## 2. シークレットを登録する

ユーザーに値を尋ねる。

```sh
gh secret set OPENROUTER_API_KEY --repo "$REPO"
gh secret set CLAUDE_CODE_OAUTH_TOKEN --repo "$REPO"
gh secret set CLOUDFLARE_ACCOUNT_ID --repo "$REPO"
gh secret set CLOUDFLARE_API_TOKEN --repo "$REPO"
```

| 名前 | 目的 |
| ------------------------- | --------------------------------------------------------- |
| `OPENROUTER_API_KEY` | 検証ワークフローにおける oxlint-plugin-decision |
| `CLAUDE_CODE_OAUTH_TOKEN` | Claude Code は検証失敗時に自動的に修正を行う |
| `CLOUDFLARE_ACCOUNT_ID` | デプロイターゲットと Alchemy の状態を保持するアカウント |
| `CLOUDFLARE_API_TOKEN` | 同一アカウント用の API トークン |

組織内のリポジトリの場合、組織のシークレットに一度登録すれば、リポジトリごとの登録は不要になる。

## 3. Actions による PR 作成を許可する

release-please と auto-fix ワークフローが PR を作成する。

```sh
gh api --method PUT "repos/$REPO/actions/permissions/workflow" \
  -f default_workflow_permissions=read -F can_approve_pull_request_reviews=true
```

## 4. PR を作成できるユーザーをコラボレーターに制限し、自動マージを有効にする

```sh
gh api --method PATCH "repos/$REPO" -f pull_request_creation_policy=collaborators_only \
  -F allow_auto_merge=true -F allow_update_branch=true
```

## 5. デフォルトブランチを保護する

デフォルトブランチにルールセットを記述する。同名のルールセットが存在する場合は置き換える。

- デフォルトブランチの削除と強制プッシュを禁止する
- `up-to-date` チェックを通過しなかった PR のマージを拒否する
- 最新のデフォルトブランチに取り込まれていない PR のマージを拒否する
- バイパスを設定しない

release-please PR の場合、Claude はデフォルトブランチを取り込んでプッシュし、`up-to-date` の後にマージを行い、そのプッシュがパスする。

```sh
id="$(gh api "repos/$REPO/rulesets" --jq '.[] | select(.name == "protect default branch") | .id')"
gh api --method "$([ -n "$id" ] && echo PUT || echo POST)" "repos/$REPO/rulesets${id:+/$id}" --input - <<'JSON'
{
  "name": "protect default branch",
  "target": "branch",
  "enforcement": "active",
  "conditions": { "ref_name": { "include": ["~DEFAULT_BRANCH"], "exclude": [] } },
  "bypass_actors": [],
  "rules": [
    { "type": "deletion" },
    { "type": "non_fast_forward" },
    {
      "type": "required_status_checks",
      "parameters": {
        "strict_required_status_checks_policy": true,
        "do_not_enforce_on_create": false,
        "required_status_checks": [{ "context": "up-to-date", "integration_id": 15368 }]
      }
    }
  ]
}
JSON
```

## 6. 変更が反映されたことを確認する

- `gh api "repos/$REPO" --jq '[.pull_request_creation_policy, .allow_auto_merge]'` は `["collaborators_only",true]` を返す
- `gh api "repos/$REPO/rules/branches/$(gh api "repos/$REPO" --jq .default_branch)" --jq '[.[].type]'` には `required_status_checks` が含まれている
