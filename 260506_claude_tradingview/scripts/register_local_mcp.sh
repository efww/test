#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SERVER_PATH="$ROOT_DIR/tradingview-mcp/src/server.js"

if ! command -v node >/dev/null 2>&1; then
  echo "node is required. Install Node.js 18+ first." >&2
  exit 1
fi

if [ ! -f "$SERVER_PATH" ]; then
  echo "MCP server not found: $SERVER_PATH" >&2
  exit 1
fi

cd "$ROOT_DIR/tradingview-mcp"
npm install

if command -v codex >/dev/null 2>&1; then
  codex mcp remove tradingview >/dev/null 2>&1 || true
  codex mcp add tradingview -- node "$SERVER_PATH"
  codex mcp get tradingview
else
  echo "codex CLI not found; skipping Codex MCP registration."
fi

mkdir -p "$HOME/.claude"
cat > "$HOME/.claude/.mcp.json" <<JSON
{
  "mcpServers": {
    "tradingview": {
      "command": "node",
      "args": [
        "$SERVER_PATH"
      ]
    }
  }
}
JSON

echo "Claude Code MCP config written to $HOME/.claude/.mcp.json"
echo "Next: launch TradingView Desktop with --remote-debugging-port=9222, restart Codex/Claude Code, then run tv_health_check."
