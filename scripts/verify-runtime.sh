#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

if command -v node >/dev/null 2>&1; then
  NODE_BIN="node"
elif [ -x "/mnt/c/Program Files/nodejs/node.exe" ]; then
  NODE_BIN="/mnt/c/Program Files/nodejs/node.exe"
else
  echo "Node runtime is not available. Install Node or expose it in PATH."
  exit 1
fi

"$NODE_BIN" scripts/smoke_runtime_check.mjs
