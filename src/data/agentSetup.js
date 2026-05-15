export const agentSetupPages = [
  {
    slug: "cursor",
    tag: "Cursor Setup",
    navTitle: "Cursor 配置教程",
    title: "Cursor 接入 MCP 的完整流程",
    description:
      "Cursor 使用 mcpServers 配置结构，CLI 会自动写入 .cursor/mcp.json。这一页展示完整配置步骤。",
    links: [
      { label: "返回 Agent Setup", to: "/agents" },
      { label: "VS Code 配置", to: "/agents/vscode" },
      { label: "Claude Code 配置", to: "/agents#claude" },
    ],
    prep: {
      overviewTitle: "Cursor MCP Server 配置",
      flowIntro:
        "下面按真实执行顺序展开：先构建 MCP Server，再通过 CLI 自动生成配置，最后验证连通性。",
      steps: [
        {
          title: "1. 构建 MCP Server",
          terminalTitle: "build mcp server",
          interactions: [
            {
              commandLines: [
                "$ cd /path/to/taurus-mcp-server",
              ],
              resultLines: [
                "进入 MCP Server 项目目录",
              ],
            },
            {
              commandLines: [
                "$ npm run build",
              ],
              resultLines: [
                "✓ Build complete",
                "MCP Server 已构建完成，dist/index.js 是入口文件",
              ],
            },
          ],
        },
        {
          title: "2. 使用 CLI 自动生成配置",
          terminalTitle: "cursor mcp init",
          interactions: [
            {
              commandLines: [
                "$ npx @huaweicloud/taurusdb-mcp init --client cursor",
              ],
              resultLines: [
                "✓ .cursor/mcp.json written",
                "配置文件已写入 Cursor 的 MCP 配置目录",
              ],
            },
            {
              commandLines: [
                "$ cat .cursor/mcp.json",
              ],
              resultLines: [
                "查看生成的配置结构",
              ],
              table: {
                headers: ["key", "value"],
                rows: [
                  ["mcpServers", "包含 huaweicloud-taurusdb"],
                  ["command", "node /path/to/mcp/dist/index.js"],
                  ["env", "TAURUSDB_CLOUD_REGION=..."],
                ],
              },
            },
          ],
        },
        {
          title: "3. 补充云凭证环境变量",
          terminalTitle: "edit cursor mcp config",
          interactions: [
            {
              commandLines: [
                "# 手动编辑 .cursor/mcp.json",
                "# 在 env 字段中添加华为云凭证",
              ],
              resultLines: [
                "Cursor 的 MCP 配置支持 env 字段",
                "需要手动补充 AK/SK 等敏感信息",
              ],
            },
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
    slug: "vscode",
    tag: "VS Code Setup",
    navTitle: "VS Code 配置教程",
    title: "VS Code 接入 MCP 的完整流程",
    description:
      "VS Code 使用 servers 配置结构，CLI 会自动写入 VS Code 的 MCP 配置。这一页展示完整配置步骤。",
    links: [
      { label: "返回 Agent Setup", to: "/agents" },
      { label: "Cursor 配置", to: "/agents/cursor" },
      { label: "Claude Code 配置", to: "/agents#claude" },
    ],
    prep: {
      overviewTitle: "VS Code MCP Server 配置",
      flowIntro:
        "下面按真实执行顺序展开：先构建 MCP Server，再通过 CLI 自动生成配置，最后验证连通性。",
      steps: [
        {
          title: "1. 构建 MCP Server",
          terminalTitle: "build mcp server",
          interactions: [
            {
              commandLines: [
                "$ cd /path/to/taurus-mcp-server",
              ],
              resultLines: [
                "进入 MCP Server 项目目录",
              ],
            },
            {
              commandLines: [
                "$ npm run build",
              ],
              resultLines: [
                "✓ Build complete",
                "MCP Server 已构建完成，dist/index.js 是入口文件",
              ],
            },
          ],
        },
        {
          title: "2. 使用 CLI 自动生成配置",
          terminalTitle: "vscode mcp init",
          interactions: [
            {
              commandLines: [
                "$ npx @huaweicloud/taurusdb-mcp init --client vscode",
              ],
              resultLines: [
                "✓ VS Code MCP config written",
                "配置文件已写入 VS Code 的 MCP 配置目录",
              ],
            },
            {
              commandLines: [
                "# VS Code 使用 servers 配置结构",
              ],
              resultLines: [
                "配置结构与 Claude Code 类似",
                "但配置文件位置不同",
              ],
              table: {
                headers: ["client", "config location", "structure"],
                rows: [
                  ["VS Code", "~/.vscode/mcp.json", "servers"],
                  ["Cursor", ".cursor/mcp.json", "mcpServers"],
                ],
              },
            },
          ],
        },
        {
          title: "3. 补充云凭证环境变量",
          terminalTitle: "edit vscode mcp config",
          interactions: [
            {
              commandLines: [
                "# 手动编辑 VS Code MCP 配置",
                "# 在 env 字段中添加华为云凭证",
              ],
              resultLines: [
                "VS Code 的 MCP 配置同样支持 env 字段",
                "需要手动补充 AK/SK 等敏感信息",
              ],
            },
            {
              commandLines: [
                "# 重启 VS Code 使配置生效",
              ],
              resultLines: [
                "关闭并重新打开 VS Code",
                "或使用 Developer: Reload Window",
              ],
            },
          ],
        },
        {
          title: "4. 验证 MCP 连通",
          terminalTitle: "verify vscode mcp",
          interactions: [
            {
              commandLines: [
                "在 VS Code 里打开 Copilot Chat",
                "切换到 Agent 模式",
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