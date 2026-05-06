# TradingView MCP + Codex Setup

## Purpose

This repo is a handoff workspace for connecting Codex or Claude Code to TradingView Desktop through `tradesdontlie/tradingview-mcp`.

The important architecture is:

```text
User prompt
  -> Codex CLI or Claude Code
  -> MCP tool call
  -> tradingview-mcp local Node server
  -> Chrome DevTools Protocol on localhost:9222
  -> TradingView Desktop app
```

Codex does not talk to TradingView directly. Codex talks to the MCP server. The MCP server controls the local TradingView Desktop app through the Electron/Chromium debug port.

This is similar in shape to controlling Chrome through CDP, but the target app is TradingView Desktop and the MCP server exposes TradingView-specific tools such as `chart_get_state`, `quote_get`, `chart_set_symbol`, `capture_screenshot`, `pine_set_source`, `alert_create`, and `watchlist_get`.

## What This Is Not

- It is not a TradingView official API integration.
- It is not an exchange or broker order-routing system.
- It does not execute real trades.
- It does not bypass TradingView subscriptions or real-time data permissions.
- It only works when TradingView Desktop is installed and launched locally with CDP enabled.

## Installed Component

- Source: `https://github.com/tradesdontlie/tradingview-mcp`
- Local path: `/home/opc/mcp/test/260506_claude_tradingview/tradingview-mcp`
- Runtime: Node.js `22.22.2`, npm `10.9.7`
- MCP server entrypoint: `src/server.js`

## MCP Registration

Codex global MCP registration:

```bash
codex mcp add tradingview -- node /home/opc/mcp/test/260506_claude_tradingview/tradingview-mcp/src/server.js
codex mcp list
```

If this repo is moved to a different machine or path, remove and re-add the MCP server with the new absolute path:

```bash
codex mcp remove tradingview
codex mcp add tradingview -- node "$PWD/tradingview-mcp/src/server.js"
codex mcp get tradingview
```

Claude Code MCP config:

```text
/home/opc/.claude/.mcp.json
```

Current config:

```json
{
  "mcpServers": {
    "tradingview": {
      "command": "node",
      "args": [
        "/home/opc/mcp/test/260506_claude_tradingview/tradingview-mcp/src/server.js"
      ]
    }
  }
}
```

If this repo is moved, update the path in `~/.claude/.mcp.json` to the new absolute path:

```json
{
  "mcpServers": {
    "tradingview": {
      "command": "node",
      "args": [
        "/ABSOLUTE/PATH/TO/260506_claude_tradingview/tradingview-mcp/src/server.js"
      ]
    }
  }
}
```

## TradingView Requirement

This MCP does not fetch market data directly from TradingView servers. It attaches to a locally running TradingView Desktop process through Chrome DevTools Protocol on port `9222`.

TradingView Desktop must be launched with:

```bash
tradingview --remote-debugging-port=9222
```

macOS:

```bash
/Applications/TradingView.app/Contents/MacOS/TradingView --remote-debugging-port=9222
```

Linux:

```bash
/opt/TradingView/tradingview --remote-debugging-port=9222
```

Windows:

```bat
%LOCALAPPDATA%\TradingView\TradingView.exe --remote-debugging-port=9222
```

Linux auto-detection checks paths such as:

```text
/opt/TradingView/tradingview
/opt/TradingView/TradingView
/home/opc/.local/share/TradingView/TradingView
/usr/bin/tradingview
/snap/tradingview/current/tradingview
```

## Verification Commands

From the MCP repo:

```bash
cd /home/opc/mcp/test/260506_claude_tradingview/tradingview-mcp
node src/cli/index.js launch
node src/cli/index.js status
```

You can also use the MCP tool after restarting Codex or Claude Code:

```text
Use tv_health_check to confirm TradingView is connected.
```

Expected healthy result after TradingView is running:

```json
{
  "success": true,
  "cdp_connected": true,
  "chart_symbol": "...",
  "api_available": true
}
```

## Current State

- `npm install` completed.
- Codex MCP server `tradingview` is registered and enabled.
- Claude Code `.mcp.json` is configured.
- CLI status currently fails because TradingView Desktop is not installed/running in this environment.
- `node src/cli/index.js launch` reports TradingView not found on Linux.
- Unit tests passed: `29 pass, 0 fail`.
- `npm install` reported 2 moderate audit findings. `npm audit fix` was not run to avoid changing dependency versions during handoff.

## Next Step

Install TradingView Desktop on the machine that has a GUI session and a valid TradingView subscription, then launch it with `--remote-debugging-port=9222`. Restart Codex or Claude Code after MCP registration so the tool list is loaded, then run `tv_health_check`.

## Local-Machine Handoff Checklist

1. Move or copy this whole repo directory to the machine that has TradingView Desktop.
2. Confirm Node.js 18+:

```bash
node --version
npm --version
```

3. Install dependencies if `node_modules` was not moved or if the OS changed:

```bash
cd /ABSOLUTE/PATH/TO/260506_claude_tradingview/tradingview-mcp
npm install
npm run test:unit
```

4. Re-register Codex MCP with the new local path:

```bash
cd /ABSOLUTE/PATH/TO/260506_claude_tradingview
codex mcp remove tradingview 2>/dev/null || true
codex mcp add tradingview -- node "$PWD/tradingview-mcp/src/server.js"
codex mcp get tradingview
```

5. Update Claude Code MCP if needed:

```bash
mkdir -p ~/.claude
cat > ~/.claude/.mcp.json <<EOF
{
  "mcpServers": {
    "tradingview": {
      "command": "node",
      "args": [
        "$PWD/tradingview-mcp/src/server.js"
      ]
    }
  }
}
EOF
```

6. Launch TradingView Desktop with debug port `9222`.
7. Restart Codex or Claude Code.
8. Run:

```text
Use tv_health_check to confirm TradingView is connected.
```

9. First useful test prompts:

```text
Use chart_get_state and quote_get to tell me what is currently open in TradingView.
```

```text
Take a chart screenshot and summarize the current visible price action.
```

```text
Read my TradingView watchlist and produce a concise market scan. Do not place trades.
```

## Operating Policy for Trading Use

- Use this initially for analysis, research, Pine Script development, alerts, and replay/backtest assistance.
- Do not allow autonomous real-money order execution through this flow.
- For every trade idea, require invalidation level, position-risk assumption, and reason not to trade.
- Prefer high-leverage tasks. Simple timeframe changes or one-off alerts are usually faster by hand.
- Keep TradingView Desktop visible on a separate monitor when the agent is operating the UI.
