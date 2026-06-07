export const agentTabs = [
  {
    id: "claude",
    label: "Claude Code",
    steps: [
      {
        label: "1. 安装 MCP Server",
        command: "$ npm install -g taurusdb-mcp",
      },
      {
        label: "2. 添加 MCP 到 Claude",
        command: `$ claude mcp add taurusdb \\
  --env TAURUSDB_CLOUD_REGION=<your-region> \\
  --env TAURUSDB_CLOUD_ACCESS_KEY_ID=<your-ak> \\
  --env TAURUSDB_CLOUD_SECRET_ACCESS_KEY=<your-sk> \\
  -- npx -y taurusdb-mcp`,
      },
      {
        label: "3. 验证连通",
        command: `$ claude
> /mcp
✔ taurusdb connected (23 tools loaded)`,
      },
    ],
  },
  {
    id: "codex",
    label: "Codex",
    steps: [
      {
        label: "1. 安装 MCP Server",
        command: "$ npm install -g taurusdb-mcp",
      },
      {
        label: "2. 通过 Codex CLI 添加",
        command: `$ codex mcp add taurusdb \\
  --env TAURUSDB_CLOUD_REGION=<your-region> \\
  --env TAURUSDB_CLOUD_ACCESS_KEY_ID=<your-ak> \\
  --env TAURUSDB_CLOUD_SECRET_ACCESS_KEY=<your-sk> \\
  -- npx -y taurusdb-mcp`,
      },
      {
        label: "3. 验证连通",
        command: `$ codex mcp list
✔ taurusdb registered
> list_cloud_taurus_instances
✔ Instance list returned`,
      },
    ],
  },
  {
    id: "cursor",
    label: "Cursor",
    steps: [
      {
        label: "1. 安装 MCP Server",
        command: "$ npm install -g taurusdb-mcp",
      },
      {
        label: "2. 编辑 ~/.cursor/mcp.json",
        command: `{
  "mcpServers": {
    "taurusdb": {
      "command": "npx",
      "args": ["-y", "taurusdb-mcp"],
      "env": {
        "TAURUSDB_CLOUD_REGION": "<your-region>",
        "TAURUSDB_CLOUD_ACCESS_KEY_ID": "<your-ak>",
        "TAURUSDB_CLOUD_SECRET_ACCESS_KEY": "<your-sk>"
      }
    }
  }
}`,
      },
      {
        label: "3. 重启 Cursor 并验证",
        command: `重启 Cursor → Agent 模式 → 输入:
> list_cloud_taurus_instances
✔ Instance list returned`,
      },
    ],
  },
];
