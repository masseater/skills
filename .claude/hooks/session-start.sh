#!/bin/bash
set -euo pipefail

if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

if ! command -v vp >/dev/null 2>&1; then
  vp_version="$(jq -r '.devDependencies["vite-plus"]' "$CLAUDE_PROJECT_DIR/package.json")"
  curl -fsSL https://vite.plus | VP_VERSION="$vp_version" VP_NODE_MANAGER=no bash >&2
  echo ". \"$HOME/.config/vite-plus/env\"" >>"$CLAUDE_ENV_FILE"
  . "$HOME/.config/vite-plus/env"
fi

cd "$CLAUDE_PROJECT_DIR"
vp install --frozen-lockfile >&2
