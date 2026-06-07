<template>
  <div>
    <HeroSection />

    <div class="divider"></div>

    <QuickStartCards />

    <div class="divider"></div>

    <DemoSection
      anchor="security"
      tag="安全架构"
      title="凭证安全<br />零泄露设计"
      description="AK/SK 和数据库密码全部通过环境变量传入 MCP Server 独立进程，从不进入 Agent 对话、从不写入日志、从不暴露在代码里。"
      :features="[
        '环境变量隔离：MCP Server 独立进程持有凭证',
        'Agent 对话中永远不会出现 AK/SK 或密码',
        '不会意外提交到 Git、不会记录在聊天记录',
        '只读账号 + 受限工具面，最小权限原则',
      ]"
    >
      <template #terminal>
        <AnimatedTerminal agentTitle="安全配置 · env 隔离">
          <div class="anim-msg anim-msg-1 term-dim" style="font-size: 0.74rem; letter-spacing: 0.05em; text-transform: uppercase; color: var(--brand);">✘ 不安全：把密码写在聊天或代码里</div>
          <div class="anim-msg anim-msg-2" style="padding: 8px 12px; border-radius: 8px; background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.2); color: rgba(239,68,68,0.8); font-size: 0.8rem; line-height: 1.6;">
            <span style="font-family: 'JetBrains Mono', monospace;">password = "S3cret@2026"</span><br />
            <span class="term-dim" style="font-size: 0.72rem;">→ 会出现在聊天记录、日志、Git 历史</span>
          </div>
          <div class="anim-msg anim-msg-3 term-dim" style="font-size: 0.74rem; letter-spacing: 0.05em; text-transform: uppercase; color: var(--success);">✔ 安全：凭证只在 MCP Server env 里</div>
          <div class="anim-msg anim-msg-4" style="padding: 10px 14px; border-radius: 8px; background: var(--success-bg); border: 1px solid rgba(34,197,94,0.18); font-size: 0.78rem; line-height: 1.75; font-family: 'JetBrains Mono', monospace;">
            <div style="color: var(--success); font-family: Inter, sans-serif; font-size: 0.72rem; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; margin-bottom: 6px;">MCP Server env 字段</div>
            <div><span class="term-info">TAURUSDB_CLOUD_ACCESS_KEY_ID</span> = <span class="term-warn">&lt;your-ak&gt;</span></div>
            <div><span class="term-info">TAURUSDB_CLOUD_SECRET_ACCESS_KEY</span> = <span class="term-warn">&lt;your-sk&gt;</span></div>
            <div><span class="term-info">TAURUSDB_SQL_USER</span> = <span class="term-warn">&lt;readonly-user&gt;</span></div>
            <div><span class="term-info">TAURUSDB_SQL_PASSWORD</span> = <span class="term-warn">&lt;readonly-password&gt;</span></div>
          </div>
          <div class="anim-msg anim-msg-5 chat-row chat-row-agent">
            <div class="chat-bubble" style="font-size: 0.82rem;">
              Agent 只能调用工具，<strong style="color:#22c55e">永远看不到</strong>这些值
            </div>
          </div>
        </AnimatedTerminal>
      </template>
    </DemoSection>

    <div class="divider"></div>

    <DemoSection
      anchor="instances"
      tag="实例发现"
      title="一句话列出<br />你的云实例"
      description="第一次使用？让 Agent 直接查询当前 AK/SK 下所有 TaurusDB 实例，确认连接正确后再进入诊断、查询等场景。"
      :features="[
        '按当前 AK/SK 自动发现同区域所有实例',
        '返回实例 ID、状态、规格、节点数',
        '确认连通性后再进入具体业务场景',
        'Agent 全程只调用工具，不接触凭证本身',
      ]"
    >
      <template #terminal>
        <AnimatedTerminal agentTitle="Claude Code + taurusdb-mcp">
          <div class="chat-row chat-row-user anim-msg anim-msg-1">
            <div class="chat-bubble">我有哪些 TaurusDB 实例？</div>
          </div>
          <div class="chat-row chat-row-agent anim-msg anim-msg-2">
            <div class="chat-bubble">我用 AK 查一下当前区域的 TaurusDB 实例列表...</div>
          </div>
          <div class="anim-msg anim-msg-3">
            <div class="tool-call">
              <span class="tool-call-name">list_cloud_taurus_instances</span><span class="tool-call-args">()</span>
            </div>
          </div>
          <div class="anim-msg anim-msg-4">
            <div class="tool-result">返回 2 个实例，状态均为 Active</div>
          </div>
          <div class="chat-row chat-row-agent anim-msg anim-msg-5">
            <div class="chat-bubble" style="line-height: 1.7;">
              当前 Region 共 <strong style="color:#f97316">2</strong> 个 TaurusDB 实例：<br />
              ① <code style="font-size: 0.82rem;">gaussdb-prod-01</code> · 4 vCPU / 16 GB · 3 节点<br />
              ② <code style="font-size: 0.82rem;">gaussdb-dev-01</code> · 2 vCPU / 8 GB · 1 节点<br />
              接下来要查询哪个实例的数据？
            </div>
          </div>
        </AnimatedTerminal>
      </template>
    </DemoSection>

    <div class="divider"></div>

    <DemoSection
      anchor="diagnostics"
      tag="运维诊断"
      title="一句话诊断<br />数据库异常"
      description="让 AI Agent 自动分析慢查询、锁等待、资源瓶颈，直接给出根因和优化建议。"
      :features="[
        '慢查询分析与索引优化建议',
        '锁等待与死锁检测，定位 blocker',
        '实例资源使用趋势监控',
        '参数配置自动巡检',
      ]"
    >
      <template #terminal>
        <AnimatedTerminal agentTitle="Claude Code + taurusdb-mcp">
          <div class="chat-row chat-row-user anim-msg anim-msg-1">
            <div class="chat-bubble">帮我分析一下最近的慢查询</div>
          </div>
          <div class="chat-row chat-row-agent anim-msg anim-msg-2">
            <div class="chat-bubble">好的，我来查询 TaurusDB 最近的慢查询统计...</div>
          </div>
          <div class="anim-msg anim-msg-3">
            <div class="tool-call">
              <span class="tool-call-name">query_slow_queries</span><span class="tool-call-args">({ timeRange: "24h", limit: 10 })</span>
            </div>
          </div>
          <div class="anim-msg anim-msg-4">
            <div class="tool-result">找到 3 条慢查询，最长执行时间 12.4s，涉及 rows_examined 25 万行</div>
          </div>
          <div class="chat-row chat-row-agent anim-msg anim-msg-5">
            <div class="chat-bubble">
              分析完毕。最可疑 SQL 命中 <code>t_orders_test</code> 表，<br />
              缺少 <code>order_date</code> 索引，建议添加复合索引：<br />
              <code style="color:#f97316">INDEX idx_order_date_status (order_date, status)</code>
            </div>
          </div>
        </AnimatedTerminal>
      </template>
    </DemoSection>

    <div class="divider"></div>

    <DemoSection
      anchor="query"
      tag="数据查询"
      title="自然语言<br />直接查数据"
      description="用自然语言提问，AI 自动生成 SQL 并执行，结果直接可视化呈现。"
      :features="[
        '自然语言转精准 SQL',
        '多表 JOIN 关联查询',
        '结果自动表格化展示',
        '查询计划自动优化建议',
      ]"
    >
      <template #terminal>
        <AnimatedTerminal agentTitle="Codex + taurusdb-mcp">
          <div class="chat-row chat-row-user anim-msg anim-msg-1">
            <div class="chat-bubble">查一下最近 7 天订单最多的前 10 个城市</div>
          </div>
          <div class="chat-row chat-row-agent anim-msg anim-msg-2">
            <div class="chat-bubble">我来查询最近 7 天的订单数据...</div>
          </div>
          <div class="anim-msg anim-msg-3">
            <div class="tool-call">
              <span class="tool-call-name">execute_readonly_sql</span><span class="tool-call-args">(sql: "SELECT city, COUNT(*) FROM orders WHERE ...")</span>
            </div>
          </div>
          <div class="anim-msg anim-msg-4">
            <div class="tool-result">查询返回 10 行，耗时 0.042s</div>
          </div>
          <div class="chat-row chat-row-agent anim-msg anim-msg-5">
            <div class="chat-bubble">
              查询完成：<br />
              🥇 上海 — 12,840 单<br />
              🥈 北京 — 11,203 单<br />
              🥉 深圳 — 9,776 单
            </div>
          </div>
        </AnimatedTerminal>
      </template>
    </DemoSection>

    <div class="divider"></div>

    <DemoSection
      anchor="taurusdb"
      tag="专属能力"
      title="发挥 TaurusDB<br />的独有价值"
      description="Recycle Bin、Dynamic Masking、Nonblocking DDL、Flashback Query —— TaurusDB 的原生能力通过 MCP 无缝对接 AI Agent。"
      :features="[
        'Recycle Bin：误删表秒级恢复',
        'Dynamic Masking：敏感字段按身份动态脱敏',
        'Nonblocking DDL：在线加列不阻断读流量',
        'Flashback Query：按时间点回查历史数据',
      ]"
    >
      <template #terminal>
        <AnimatedTerminal agentTitle="Cursor + taurusdb-mcp">
          <div class="chat-row chat-row-user anim-msg anim-msg-1">
            <div class="chat-bubble">t_recycle_bin_test 表不见了，帮我恢复</div>
          </div>
          <div class="anim-msg anim-msg-2">
            <div class="tool-call">
              <span class="tool-call-name">list_recycle_bin</span><span class="tool-call-args">()</span>
            </div>
          </div>
          <div class="anim-msg anim-msg-3">
            <div class="tool-result">回收站中找到 t_recycle_bin_test，删除时间 2026-05-13 10:35:00</div>
          </div>
          <div class="chat-row chat-row-agent anim-msg anim-msg-4">
            <div class="chat-bubble">
              恢复操作需要二次确认。<br />
              确认恢复该表吗？回复「确认」执行。
            </div>
          </div>
          <div class="chat-row chat-row-user anim-msg anim-msg-5">
            <div class="chat-bubble">确认</div>
          </div>
          <div class="anim-msg anim-msg-6">
            <div class="tool-result">✔ 表 t_recycle_bin_test 恢复成功，3 rows recovered</div>
          </div>
        </AnimatedTerminal>
      </template>
    </DemoSection>

    <div class="divider"></div>

    <AgentTabs />

    <div class="divider"></div>

    <footer class="footer">
      <div class="footer-inner">
        <div class="footer-cta reveal">
          <h2>开始使用 OpenTaurus</h2>
          <p class="text-2">5 分钟内完成接入，让 AI 真正操控你的数据库</p>
          <div class="btn-row btn-row-center">
            <a href="#quickstart" class="btn btn-primary">快速开始 →</a>
            <a
              href="https://github.com/youweichen0208/taurus-mcp-server"
              target="_blank"
              rel="noopener noreferrer"
              class="btn btn-ghost"
            >GitHub</a>
          </div>
        </div>
        <div class="footer-bar">
          <div class="footer-copy">
            <strong>OpenTaurus</strong>
            <span class="text-3">· Powered by Vite + Vue 3</span>
          </div>
          <div class="footer-links">
            <a
              href="https://github.com/youweichen0208/taurus-mcp-server"
              target="_blank"
              rel="noopener noreferrer"
            >GitHub</a>
            <span class="text-3">MIT License</span>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import HeroSection from "../components/HeroSection.vue";
import QuickStartCards from "../components/QuickStartCards.vue";
import DemoSection from "../components/DemoSection.vue";
import AnimatedTerminal from "../components/AnimatedTerminal.vue";
import AgentTabs from "../components/AgentTabs.vue";
</script>
