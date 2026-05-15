<template>
  <div>
    <HeroSection
      eyebrow="Agent Setup"
      title="接入 MCP 的完整配置教程"
      description="如何在 Claude Code、Cursor、VS Code 里接入 TaurusDB MCP Server。这一页面向第一次配置 Agent 的用户，按真实可走通的顺序展开。"
      terminal-title="mcp client config"
      :terminal-lines="[
        'Claude Code → claude mcp add huaweicloud-taurusdb',
        'Cursor → .cursor/mcp.json',
        'VS Code → servers config',
        'adds server: huaweicloud-taurusdb'
      ]"
      :links="[
        { label: '返回首页', to: '/' },
        { label: 'MCP 总览', to: '/mcp' },
        { label: 'TaurusDB 专属能力', to: '/mcp/taurusdb' }
      ]"
    />

    <div class="divider"></div>

    <!-- Claude Section -->
    <section class="band section-anchor" id="claude">
      <div class="section-inner">
        <div class="section-head">
          <span class="mode-tag mono">Claude Code</span>
          <h2>Claude Code 接入路径</h2>
          <p>下面是一条最短可走通的 Claude Code 接入路径，按 Build → Add MCP → Verify → Test 的顺序展开。</p>
        </div>

        <div class="prep-steps">
          <!-- Step 1: Build -->
          <div class="step-shell">
            <div class="step-head">
              <span class="mode-tag mono">Step 1</span>
              <h3>构建 MCP Server</h3>
            </div>
            <div class="setup-terminal-card">
              <div class="terminal-head">
                <div class="lights">
                  <span class="r"></span>
                  <span class="y"></span>
                  <span class="g"></span>
                </div>
                <span class="terminal-title mono">shell</span>
              </div>
              <div class="terminal-body setup-terminal-body">
                <div class="setup-interaction">
                  <div class="setup-command-line mono">cd /path/to/taurus-mcp-server</div>
                  <div class="setup-command-line mono">npm run build</div>
                  <div class="setup-result-line mono">✓ Build complete</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Step 2: Add MCP Server -->
          <div class="step-shell">
            <div class="step-head">
              <span class="mode-tag mono">Step 2</span>
              <h3>添加 MCP Server 到 Claude Code</h3>
            </div>
            <p class="quote-box">如果你希望 Claude Code 直接带着华为云控制面配置启动，推荐一次性把 `region + AK/SK` 写进 MCP 配置，而不是依赖外部 shell 的 `export`。</p>
            <div class="setup-terminal-card">
              <div class="terminal-head">
                <div class="lights">
                  <span class="r"></span>
                  <span class="y"></span>
                  <span class="g"></span>
                </div>
                <span class="terminal-title mono">shell</span>
              </div>
              <div class="terminal-body setup-terminal-body">
                <div class="setup-interaction">
                  <div class="setup-command-line mono">claude mcp add huaweicloud-taurusdb \</div>
                  <div class="setup-command-line mono">  --transport stdio \</div>
                  <div class="setup-command-line mono">  -e TAURUSDB_CLOUD_REGION=&lt;your-region&gt; \</div>
                  <div class="setup-command-line mono">  -e TAURUSDB_CLOUD_ACCESS_KEY_ID=&lt;your-ak&gt; \</div>
                  <div class="setup-command-line mono">  -e TAURUSDB_CLOUD_SECRET_ACCESS_KEY=&lt;your-sk&gt; \</div>
                  <div class="setup-command-line mono">  -e TAURUSDB_SQL_DATABASE=&lt;your-database&gt; \</div>
                  <div class="setup-command-line mono">  -e TAURUSDB_SQL_USER=&lt;your-readonly-user&gt; \</div>
                  <div class="setup-command-line mono">  -e TAURUSDB_SQL_PASSWORD=&lt;your-readonly-password&gt; \</div>
                  <div class="setup-command-line mono">  -- node /path/to/taurus-mcp-server/packages/mcp/dist/index.js</div>
                  <div class="setup-result-line mono">✓ MCP server registered</div>
                </div>
              </div>
            </div>
            <p class="agent-note mono">如果你使用的是临时凭证，再补 `-e TAURUSDB_CLOUD_SECURITY_TOKEN=&lt;your-session-token&gt;`</p>
          </div>

          <!-- Step 3: Verify Registration -->
          <div class="step-shell">
            <div class="step-head">
              <span class="mode-tag mono">Step 3</span>
              <h3>验证 MCP 注册</h3>
            </div>
            <div class="setup-terminal-card">
              <div class="terminal-head">
                <div class="lights">
                  <span class="r"></span>
                  <span class="y"></span>
                  <span class="g"></span>
                </div>
                <span class="terminal-title mono">shell</span>
              </div>
              <div class="terminal-body setup-terminal-body">
                <div class="setup-interaction">
                  <div class="setup-command-line mono">claude mcp list</div>
                  <div class="setup-result-line mono">huaweicloud-taurusdb</div>
                  <div class="setup-command-line mono">claude mcp get huaweicloud-taurusdb</div>
                  <div class="setup-result-line mono">command: node /path/to/mcp/dist/index.js</div>
                  <div class="setup-result-line mono">env: TAURUSDB_CLOUD_REGION=...</div>
                </div>
              </div>
            </div>
            <ul class="compact-list">
              <li>检查重点：`huaweicloud-taurusdb` 已出现在 `claude mcp list`</li>
              <li>`claude mcp get` 能看到正确的 `command`</li>
              <li>如果你通过 `-e` 写入了云配置，`env` 不应为空</li>
            </ul>
          </div>

          <!-- Step 4: Verify Cloud Control Plane -->
          <div class="step-shell">
            <div class="step-head">
              <span class="mode-tag mono">Step 4</span>
              <h3>验证云控制面连通</h3>
            </div>
            <p class="quote-box">在 Claude Code 里用自然语言提问，让 Claude 调用 MCP 工具查询华为云实例列表。</p>
            <div class="setup-terminal-card claude-terminal">
              <div class="terminal-head">
                <span class="terminal-title mono">claude code</span>
              </div>
              <div class="terminal-body setup-terminal-body">
                <div class="setup-interaction">
                  <div class="claude-chat-line mono">帮我查一下华为云上的 TaurusDB 实例列表</div>
                  <div class="claude-tool-call mono">
                    <div class="tool-header">
                      <span class="tool-icon">⏺</span>
                      <span class="tool-name">huaweicloud-taurusdb - list_cloud_taurus_instances</span>
                      <span class="tool-params">(MCP)</span>
                    </div>
                    <div class="claude-tool-result">
                      <span class="result-key">ok:</span> <span class="result-value">true</span>,
                      <span class="result-key">instances:</span> <span class="result-value">[...]</span>
                    </div>
                  </div>
                  <div class="claude-response">返回 3 个实例，说明 MCP 会话已经能访问华为云控制面。</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Step 5: Verify Data Plane -->
          <div class="step-shell">
            <div class="step-head">
              <span class="mode-tag mono">Step 5</span>
              <h3>验证数据库数据面连通</h3>
            </div>
            <p class="quote-box">控制面通过后，继续用自然语言让 Claude 执行一条简单的 SQL 查询。</p>
            <div class="setup-terminal-card claude-terminal">
              <div class="terminal-head">
                <span class="terminal-title mono">claude code</span>
              </div>
              <div class="terminal-body setup-terminal-body">
                <div class="setup-interaction">
                  <div class="claude-chat-line mono">在数据库里执行 SELECT 1 验证连通</div>
                  <div class="claude-tool-call mono">
                    <div class="tool-header">
                      <span class="tool-icon">⏺</span>
                      <span class="tool-name">huaweicloud-taurusdb - execute_readonly_sql</span>
                      <span class="tool-params">(MCP)</span>
                    </div>
                    <div class="claude-tool-result">
                      <span class="result-key">ok:</span> <span class="result-value">true</span>,
                      <span class="result-key">rows:</span> <span class="result-value">1</span>
                    </div>
                  </div>
                  <div class="claude-response">Query OK, 1 row in set — 数据库数据面已连通。</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <div class="divider"></div>

    <!-- Other Clients Section -->
    <section class="band section-anchor" id="others">
      <div class="section-inner">
        <div class="section-head">
          <span class="mode-tag mono">Cursor & VS Code</span>
          <h2>其他客户端接入</h2>
          <p>Cursor 和 VS Code 使用不同的 MCP 配置结构，点击下方卡片查看完整配置步骤。</p>
        </div>

        <div class="triptych">
          <RouterLink
            v-for="item in agentSetupPages"
            :key="item.slug"
            class="card card-link"
            :to="`/agents/${item.slug}`"
          >
            <span class="mode-tag mono">{{ item.tag }}</span>
            <h3>{{ item.navTitle }}</h3>
            <p>{{ item.description }}</p>
          </RouterLink>

          <article class="card">
            <span class="mode-tag mono">Manual</span>
            <h3>手动配置</h3>
            <p>如果你的客户端不在上述列表中，可以手动复制配置结构并调整配置文件位置。</p>
            <ul class="compact-list">
              <li>Cursor: `.cursor/mcp.json` 使用 `mcpServers`</li>
              <li>VS Code: 使用 `servers` 配置结构</li>
              <li>确认 `command` 指向正确的 MCP 入口</li>
            </ul>
          </article>
        </div>
      </div>
    </section>

    <div class="divider"></div>

    <!-- Common Issues Section -->
    <section class="band section-anchor" id="common-issues">
      <div class="section-inner">
        <div class="section-head">
          <span class="mode-tag mono">Troubleshooting</span>
          <h2>常见问题排查</h2>
          <p>如果 MCP 调用返回错误，按下面的顺序检查环境变量和凭证配置。</p>
        </div>

        <div class="callout-grid">
          <article class="card">
            <span class="mode-tag mono">INVALID_INPUT</span>
            <h3>`list_cloud_taurus_instances` 返回错误</h3>
            <p>这通常说明当前 MCP 进程没有拿到云控制面环境变量：</p>
            <ul class="compact-list">
              <li>`TAURUSDB_CLOUD_REGION`</li>
              <li>`TAURUSDB_CLOUD_ACCESS_KEY_ID`</li>
              <li>`TAURUSDB_CLOUD_SECRET_ACCESS_KEY`</li>
            </ul>
            <p style="margin-top: 12px;"><strong>最常见原因：</strong></p>
            <ul class="compact-list">
              <li>在外部 shell 里执行了 `export`，但 Claude Code 的 MCP 进程早已启动</li>
              <li>修改了环境变量，但没有重启 Claude Code 会话</li>
              <li>`claude mcp add` 时没有把 `-e` 写进 MCP 配置</li>
            </ul>
          </article>

          <article class="card">
            <span class="mode-tag mono">401 Signature</span>
            <h3>`401 verify ak sk signature failed`</h3>
            <p>如果 `list_cloud_taurus_instances` 返回 `401`，通常说明：</p>
            <ul class="compact-list">
              <li>`AK/SK` 填错</li>
              <li>使用的是临时凭证但缺少 `TAURUSDB_CLOUD_SECURITY_TOKEN`</li>
              <li>`AK/SK` 已禁用或已重置</li>
            </ul>
            <p style="margin-top: 12px;"><strong>修复步骤：</strong>检查凭证本身，而不是 `project_id`。</p>
          </article>
        </div>

        <div class="step-shell" style="margin-top: 28px;">
          <div class="step-head">
            <span class="mode-tag mono">Fix</span>
            <h3>修复缺失的云配置</h3>
          </div>
          <div class="setup-terminal-card">
            <div class="terminal-head">
              <div class="lights">
                <span class="r"></span>
                <span class="y"></span>
                <span class="g"></span>
              </div>
              <span class="terminal-title mono">shell</span>
            </div>
            <div class="terminal-body setup-terminal-body">
              <div class="setup-interaction">
                <div class="setup-command-line mono">claude mcp get huaweicloud-taurusdb</div>
                <div class="setup-result-line mono">如果 env 为空，直接重配：</div>
                <div class="setup-command-line mono">claude mcp add "huaweicloud-taurusdb" \</div>
                <div class="setup-command-line mono">  --transport stdio \</div>
                <div class="setup-command-line mono">  -s local \</div>
                <div class="setup-command-line mono">  -e TAURUSDB_CLOUD_REGION=cn-east-3 \</div>
                <div class="setup-command-line mono">  -e TAURUSDB_CLOUD_ACCESS_KEY_ID=&lt;your-ak&gt; \</div>
                <div class="setup-command-line mono">  -e TAURUSDB_CLOUD_SECRET_ACCESS_KEY=&lt;your-sk&gt; \</div>
                <div class="setup-command-line mono">  -e TAURUSDB_SQL_DATABASE=&lt;your-database&gt; \</div>
                <div class="setup-command-line mono">  -e TAURUSDB_SQL_USER=&lt;your-readonly-user&gt; \</div>
                <div class="setup-command-line mono">  -e TAURUSDB_SQL_PASSWORD=&lt;your-readonly-password&gt; \</div>
                <div class="setup-command-line mono">  -- node /path/to/mcp/dist/index.js</div>
                <div class="setup-result-line mono">✓ MCP config updated with env</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { RouterLink } from "vue-router";
import HeroSection from "../components/HeroSection.vue";
import { agentSetupPages } from "../data/agentSetup";
</script>