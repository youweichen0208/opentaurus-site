export const agentSetupPages = [
  {
    slug: "cursor",
    tag: "Cursor Setup",
    navTitle: "Cursor 配置教程",
    title: "Cursor 接入 MCP 的完整流程",
    description:
      "Cursor 使用 mcpServers 配置结构，手动编辑 ~/.cursor/mcp.json。这一页展示通过 npm 包启动 MCP 的完整配置步骤。",
    links: [
      { label: "返回 Agent Setup", to: "/agents" },
      { label: "Codex 配置", to: "/agents/codex" },
      { label: "Claude Code 配置", to: "/agents#claude" },
    ],
    prep: {
      overviewTitle: "Cursor MCP Server 配置",
      flowIntro:
        "下面按真实执行顺序展开：先确认 npm 包可启动，再手动编辑配置文件，最后验证连通性。",
      steps: [
        {
          title: "1. 确认 npm 包可启动",
          terminalTitle: "npm package",
          interactions: [
            {
              commandLines: [
                "$ npx -y taurusdb-mcp --version",
              ],
              resultLines: [
                "✓ taurusdb-mcp is available from npm",
                "Cursor 配置中会通过 npx 拉起这个 MCP Server",
              ],
            },
          ],
        },
        {
          title: "2. 创建 .cursor/mcp.json 配置文件",
          terminalTitle: "cursor mcp config",
          interactions: [
            {
              commandLines: [
                "# 创建或编辑 ~/.cursor/mcp.json",
              ],
              resultLines: [
                "Cursor 使用 mcpServers 配置结构",
              ],
            },
            {
              commandLines: [
                "{",
                "  \"mcpServers\": {",
                "    \"huaweicloud-taurusdb\": {",
                "      \"command\": \"npx\",",
                "      \"args\": [\"-y\", \"taurusdb-mcp\"],",
                "      \"env\": {",
                "        \"TAURUSDB_CLOUD_REGION\": \"<your-region>\",",
                "        \"TAURUSDB_CLOUD_ACCESS_KEY_ID\": \"<your-ak>\",",
                "        \"TAURUSDB_CLOUD_SECRET_ACCESS_KEY\": \"<your-sk>\",",
                "        \"TAURUSDB_SQL_DATABASE\": \"<your-database>\",",
                "        \"TAURUSDB_SQL_USER\": \"<your-readonly-user>\",",
                "        \"TAURUSDB_SQL_PASSWORD\": \"<your-readonly-password>\"",
                "      }",
                "    }",
                "  }",
                "}",
              ],
              resultLines: [
                "把云控制面和只读数据面配置写进 env 字段",
                "command 使用 npx，args 使用已发布的 taurusdb-mcp 包",
              ],
            },
          ],
        },
        {
          title: "3. 重启 Cursor 使配置生效",
          terminalTitle: "reload cursor",
          interactions: [
            {
              commandLines: [
                "$ cursor --reload",
              ],
              resultLines: [
                "重启 Cursor 使配置生效",
                "或者关闭并重新打开 Cursor",
              ],
            },
          ],
        },
        {
          title: "4. 验证 MCP 连通",
          terminalTitle: "verify cursor mcp",
          interactions: [
            {
              commandLines: [
                "在 Cursor 里打开 Agent 模式",
                "输入: list_cloud_taurus_instances",
              ],
              resultLines: [
                "✓ Instance list returned",
                "说明 MCP 会话已能访问华为云控制面",
              ],
            },
            {
              commandLines: [
                "继续输入: execute_readonly_sql",
                "sql: SELECT 1 AS ok",
              ],
              resultLines: [
                "✓ Query OK, 1 row in set",
                "说明数据库数据面也已连通",
              ],
            },
          ],
        },
      ],
    },
  },
  {
    slug: "codex",
    tag: "Codex Setup",
    navTitle: "Codex 配置教程",
    title: "Codex 接入 MCP 的完整流程",
    description:
      "Codex 使用 ~/.codex/config.toml 中的 mcp_servers 配置结构，也可以通过 codex mcp add 命令写入配置。",
    links: [
      { label: "返回 Agent Setup", to: "/agents" },
      { label: "Cursor 配置", to: "/agents/cursor" },
      { label: "Claude Code 配置", to: "/agents#claude" },
    ],
    prep: {
      overviewTitle: "Codex MCP Server 配置",
      flowIntro:
        "下面按真实执行顺序展开：先确认 npm 包可启动，再通过 Codex CLI 添加 MCP Server，最后验证连通性。",
      steps: [
        {
          title: "1. 确认 npm 包可启动",
          terminalTitle: "npm package",
          interactions: [
            {
              commandLines: [
                "$ npx -y taurusdb-mcp --version",
              ],
              resultLines: [
                "✓ taurusdb-mcp is available from npm",
                "Codex 配置中会通过 npx 拉起这个 MCP Server",
              ],
            },
          ],
        },
        {
          title: "2. 通过 Codex CLI 添加 MCP Server",
          terminalTitle: "codex mcp add",
          interactions: [
            {
              commandLines: [
                "$ codex mcp add huaweicloud-taurusdb \\",
                "  --env TAURUSDB_CLOUD_REGION=<your-region> \\",
                "  --env TAURUSDB_CLOUD_ACCESS_KEY_ID=<your-ak> \\",
                "  --env TAURUSDB_CLOUD_SECRET_ACCESS_KEY=<your-sk> \\",
                "  --env TAURUSDB_SQL_DATABASE=<your-database> \\",
                "  --env TAURUSDB_SQL_USER=<your-readonly-user> \\",
                "  --env TAURUSDB_SQL_PASSWORD=<your-readonly-password> \\",
                "  -- npx -y taurusdb-mcp",
              ],
              resultLines: [
                "✓ MCP server registered in ~/.codex/config.toml",
                "Codex CLI 和 Codex IDE extension 会读取同一份配置",
              ],
            },
          ],
        },
        {
          title: "3. 等价的 ~/.codex/config.toml",
          terminalTitle: "codex config",
          interactions: [
            {
              commandLines: [
                "[mcp_servers.huaweicloud-taurusdb]",
                "command = \"npx\"",
                "args = [\"-y\", \"taurusdb-mcp\"]",
                "enabled = true",
                "",
                "[mcp_servers.huaweicloud-taurusdb.env]",
                "TAURUSDB_CLOUD_REGION = \"<your-region>\"",
                "TAURUSDB_CLOUD_ACCESS_KEY_ID = \"<your-ak>\"",
                "TAURUSDB_CLOUD_SECRET_ACCESS_KEY = \"<your-sk>\"",
                "TAURUSDB_SQL_DATABASE = \"<your-database>\"",
                "TAURUSDB_SQL_USER = \"<your-readonly-user>\"",
                "TAURUSDB_SQL_PASSWORD = \"<your-readonly-password>\"",
              ],
              resultLines: [
                "手动配置时使用 mcp_servers.<server-name>",
                "临时凭证需要再补 TAURUSDB_CLOUD_SECURITY_TOKEN",
              ],
              table: {
                headers: ["client", "config location", "structure"],
                rows: [
                  ["Codex", "~/.codex/config.toml", "mcp_servers"],
                  ["Cursor", "~/.cursor/mcp.json", "mcpServers"],
                ],
              },
            },
          ],
        },
        {
          title: "4. 验证 Codex MCP 配置",
          terminalTitle: "verify codex mcp",
          interactions: [
            {
              commandLines: [
                "$ codex mcp list",
              ],
              resultLines: [
                "huaweicloud-taurusdb",
                "如果在 IDE extension 中使用 Codex，重启窗口后再验证工具是否出现",
              ],
            },
          ],
        },
        {
          title: "5. 验证 MCP 连通",
          terminalTitle: "call mcp tools",
          interactions: [
            {
              commandLines: [
                "在 Codex 里打开一个会话",
                "输入: list_cloud_taurus_instances",
              ],
              resultLines: [
                "✓ Instance list returned",
                "说明 MCP 会话已能访问华为云控制面",
              ],
            },
            {
              commandLines: [
                "继续输入: execute_readonly_sql",
                "sql: SELECT 1 AS ok",
              ],
              resultLines: [
                "✓ Query OK, 1 row in set",
                "说明数据库数据面也已连通",
              ],
            },
          ],
        },
      ],
    },
  },
];

export function getAgentSetupPage(slug) {
  return agentSetupPages.find((item) => item.slug === slug);
}
