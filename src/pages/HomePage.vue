<template>
  <div>
    <HeroSection />

    <div class="divider"></div>

    <QuickStartCards />

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

    <!-- 运维诊断：报告 3.1 + 3.2，详细根因分析 -->
    <DemoSection
      anchor="diagnostics"
      tag="运维诊断"
      title="一句话诊断<br />慢查询根因"
      description="从模糊匹配到无索引排序，AI 自动识别慢 SQL、分析执行计划，给出可直接落地的索引和分页模式建议。"
      :features="[
        '扫描 digest 库，定位最可疑 SQL',
        '拆解执行计划：模糊匹配 / 排序 / OFFSET',
        '结合索引命中情况给出优化建议',
        '从根因到方案的闭环诊断',
      ]"
    >
      <template #terminal>
        <AnimatedTerminal agentTitle="Claude Code + taurusdb-mcp">
          <div class="chat-row chat-row-user anim-msg anim-msg-1">
            <div class="chat-bubble">帮我分析最近的慢查询，找出根因</div>
          </div>
          <div class="anim-msg anim-msg-2">
            <div class="tool-call">
              <span class="tool-call-name">find_top_slow_sql</span><span class="tool-call-args">({ timeRange: "24h", limit: 10 })</span>
            </div>
            <div class="tool-result">
              命中: SELECT ... FROM t_orders_test WHERE note LIKE '%999%' ORDER BY created_at DESC LIMIT 100 OFFSET 500
            </div>
          </div>
          <div class="anim-msg anim-msg-3">
            <div class="tool-call">
              <span class="tool-call-name">diagnose_slow_query</span><span class="tool-call-args">(sql: "...")</span>
            </div>
          </div>
          <div class="anim-msg anim-msg-4" style="padding: 10px 14px; border-radius: 8px; background: var(--brand-bg); border: 1px solid rgba(249,115,22,0.2); font-size: 0.78rem; line-height: 1.75;">
            <div style="color: var(--brand); font-size: 0.72rem; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; margin-bottom: 6px;">执行计划分析</div>
            <div><span class="term-info">avg_latency</span> 517.85ms</div>
            <div><span class="term-info">rows_examined</span> 250,600 行</div>
            <div><span style="color: rgba(239,68,68,0.9);">✘</span> LIKE '%999%' 前导通配符，无法利用索引</div>
            <div><span style="color: rgba(239,68,68,0.9);">✘</span> ORDER BY + OFFSET 全表扫描叠加排序</div>
          </div>
          <div class="chat-row chat-row-agent anim-msg anim-msg-5">
            <div class="chat-bubble" style="line-height: 1.7;">
              诊断结论：<br />
              1. <code style="color:#f97316">LIKE '%999%'</code> 改成前缀匹配 <code style="color:#22c55e">LIKE '999%'</code><br />
              2. 添加复合索引：<code style="color:#22c55e">idx_order_status (created_at DESC, status)</code><br />
              3. <code style="color:#f97316">OFFSET 500</code> 改成游标分页<br />
              预计提速 <strong style="color:#22c55e">50x+</strong>
            </div>
          </div>
        </AnimatedTerminal>
      </template>
    </DemoSection>

    <div class="divider"></div>

    <!-- 锁竞争：报告 3.4-3.6 -->
    <DemoSection
      anchor="locks"
      tag="锁竞争"
      title="精准定位<br />blocker 和 waiter"
      description="把 processlist 快照转换成「谁持锁 / 谁等待 / 热点在哪」的关系链，AI 直接告诉你应该先处理哪个会话。"
      :features="[
        '单 blocker / 单 waiter：快速锁定持锁会话',
        '单 blocker / 多 waiter：聚合型锁等待',
        'metadata lock：DDL 被阻塞也能定位',
        '给出 kill / 业务热点行拆分的建议',
      ]"
    >
      <template #terminal>
        <AnimatedTerminal agentTitle="Cursor + taurusdb-mcp">
          <div class="chat-row chat-row-user anim-msg anim-msg-1">
            <div class="chat-bubble">UPDATE t_hot_counter_test 卡住了，是谁在挡我？</div>
          </div>
          <div class="anim-msg anim-msg-2">
            <div class="tool-call">
              <span class="tool-call-name">show_processlist</span><span class="tool-call-args">()</span>
            </div>
            <div class="tool-result">
              发现 2 个会话并发 UPDATE 同一行 (counter_key='global')
            </div>
          </div>
          <div class="anim-msg anim-msg-3">
            <div class="tool-call">
              <span class="tool-call-name">diagnose_lock_contention</span><span class="tool-call-args">()</span>
            </div>
          </div>
          <div class="anim-msg anim-msg-4" style="padding: 10px 14px; border-radius: 8px; background: var(--brand-bg); border: 1px solid rgba(249,115,22,0.2); font-size: 0.78rem; line-height: 1.75;">
            <div style="color: var(--brand); font-size: 0.72rem; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; margin-bottom: 6px;">锁竞争详情</div>
            <div><span class="term-info">severity</span> Warning</div>
            <div><span class="term-info">热点表</span> t_hot_counter_test</div>
            <div><span class="term-info">最长等待</span> &gt;= 60s</div>
            <div><span style="color: rgba(239,68,68,0.9);">blocker</span> 会话 55860 · user youweichen</div>
          </div>
          <div class="chat-row chat-row-agent anim-msg anim-msg-5">
            <div class="chat-bubble" style="line-height: 1.7;">
              这是<strong style="color:#f97316">单 blocker 阻塞</strong>：会话 55860 持有行锁未提交，导致当前 UPDATE 等待 &gt;= 60s。<br /><br />
              建议：<br />
              1. 确认会话 55860 是否应该提交/回滚<br />
              2. 业务侧拆分 counter_key='global' 热点行，避免同一行并发 UPDATE
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

    <!-- Flashback Query: 报告 3.9 -->
    <DemoSection
      anchor="flashback"
      tag="Flashback Query"
      title="按时间点回查<br />历史态数据"
      description="误更新排查、状态流转核对、审计事实确认 —— 不用先恢复数据，也能回答「某个时刻这条记录到底是什么值」。"
      :features="[
        '按历史时间点（绝对 / 相对）读取旧值',
        '与当前态直接对照，差异一目了然',
        '要求表建表时开启 BACKQUERY=1',
        '误更新排查、状态流转核对',
      ]"
    >
      <template #terminal>
        <AnimatedTerminal agentTitle="Claude Code + taurusdb-mcp">
          <div class="chat-row chat-row-user anim-msg anim-msg-1">
            <div class="chat-bubble">订单 1 状态刚才改错，想看更新前是什么</div>
          </div>
          <div class="anim-msg anim-msg-2">
            <div class="tool-call">
              <span class="tool-call-name">flashback_query</span><span class="tool-call-args">({ table: "t_flashback_query_test", id: 1, at: "2026-05-13 11:04:39" })</span>
            </div>
            <div class="tool-result">
              ✔ 表开启 BACKQUERY=1，支持回查
            </div>
          </div>
          <div class="anim-msg anim-msg-3" style="padding: 10px 14px; border-radius: 8px; background: var(--surface); border: 1px solid var(--border); font-size: 0.78rem; line-height: 1.75;">
            <div style="color: var(--text-2); font-size: 0.72rem; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; margin-bottom: 6px;">回查结果对照</div>
            <div><span class="term-info">时间点</span> T1 = 2026-05-13 11:04:39</div>
            <div><span style="color: var(--text-3);">历史态 status</span> = <strong style="color: var(--warning);">draft</strong></div>
            <div><span style="color: var(--text-3);">当前态 status</span> = <strong style="color: var(--success);">published</strong></div>
          </div>
          <div class="chat-row chat-row-agent anim-msg anim-msg-4">
            <div class="chat-bubble" style="line-height: 1.7;">
              找到：<br />
              在 T1（11:04:39）时刻 status = <code style="color:#fbbf24">draft</code><br />
              之后被 UPDATE 为 <code style="color:#22c55e">published</code><br /><br />
              如需要恢复历史态，需要应用侧执行 UPDATE（Agent 只读）。
            </div>
          </div>
        </AnimatedTerminal>
      </template>
    </DemoSection>

    <div class="divider"></div>

    <TaurusScenariosTabs />

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
import TaurusScenariosTabs from "../components/TaurusScenariosTabs.vue";
</script>
