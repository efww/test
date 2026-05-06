# Codex + TradingView MCP Handoff

This workspace prepares `tradesdontlie/tradingview-mcp` for use with Codex CLI or Claude Code.

Read first:

- `docs/260505_1_tradingview_mcp_codex_setup.md`

Architecture:

```text
Codex or Claude Code
  -> MCP server: tradingview-mcp
  -> Chrome DevTools Protocol on localhost:9222
  -> TradingView Desktop
```

Current status:

- `tradingview-mcp` is downloaded in this repo.
- `npm install` has been run in the current Linux environment.
- Codex MCP was registered on this machine.
- Claude Code MCP config was written on this machine.
- TradingView Desktop is not installed here, so live connection is not yet verified.

On the actual local desktop machine:

```bash
cd /ABSOLUTE/PATH/TO/260506_claude_tradingview
./scripts/register_local_mcp.sh
```

Then launch TradingView Desktop with the debug port:

```bash
/Applications/TradingView.app/Contents/MacOS/TradingView --remote-debugging-port=9222
```

or use the OS-specific launch scripts inside `tradingview-mcp/scripts/`.

After restarting Codex or Claude Code, verify with:

```text
Use tv_health_check to confirm TradingView is connected.
```
