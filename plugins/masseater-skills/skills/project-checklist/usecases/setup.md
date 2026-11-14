# Aligning the GitHub-side settings

Let the target repository be `REPO=<owner>/<name>`.

## 1. Change the app name

`APP_NAME` in `apps/web/app-name.ts` is still the template's name. Change it to match the repository name. If the name collides with another repository in the same Cloudflare account, they replace each other's resources.

## 2. Register secrets

Ask the user for the values.

```sh
gh secret set OPENROUTER_API_KEY --repo "$REPO"
gh secret set CLAUDE_CODE_OAUTH_TOKEN --repo "$REPO"
gh secret set CLOUDFLARE_ACCOUNT_ID --repo "$REPO"
gh secret set CLOUDFLARE_API_TOKEN --repo "$REPO"
```

| Name                      | Purpose                                                   |
| ------------------------- | --------------------------------------------------------- |
| `OPENROUTER_API_KEY`      | oxlint-plugin-decision in the verify workflow             |
| `CLAUDE_CODE_OAUTH_TOKEN` | Claude Code fixes things automatically when verify fails  |
| `CLOUDFLARE_ACCOUNT_ID`   | The account holding the deploy target and Alchemy's state |
| `CLOUDFLARE_API_TOKEN`    | An API token for the same account                         |

For a repository in an organization, registering once in the organization's secrets makes per-repository registration unnecessary.

## 3. Allow Actions to create PRs

release-please and the auto-fix workflow create PRs.

```sh
gh api --method PUT "repos/$REPO/actions/permissions/workflow" \
  -f default_workflow_permissions=read -F can_approve_pull_request_reviews=true
```

## 4. Limit who can create PRs to collaborators, and enable auto-merge

```sh
gh api --method PATCH "repos/$REPO" -f pull_request_creation_policy=collaborators_only \
  -F allow_auto_merge=true -F allow_update_branch=true
```

## 5. Protect the default branch

Put a ruleset on the default branch. If a ruleset with the same name exists, replace it.

- Forbid deleting and force-pushing the default branch
- Reject merging PRs that have not passed the `up-to-date` check
- Reject merging PRs that have not taken in the latest default branch
- Do not set any bypass

For release-please PRs, Claude takes in the default branch and pushes, and merges after `up-to-date`, run by that push, passes.

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

## 6. Confirm the changes took effect

- `gh api "repos/$REPO" --jq '[.pull_request_creation_policy, .allow_auto_merge]'` returns `["collaborators_only",true]`
- `gh api "repos/$REPO/rules/branches/$(gh api "repos/$REPO" --jq .default_branch)" --jq '[.[].type]'` contains `required_status_checks`
