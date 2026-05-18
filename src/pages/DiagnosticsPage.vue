<template>
  <div>
    <HeroSection
      eyebrow="Ops Diagnostics"
      title="把慢、卡、堵拆成可追踪的诊断链路"
      description="这一页只讲运维诊断问题：慢 SQL、锁竞争、连接堆积和存储压力。每个演示都保留用户输入、MCP 工具调用、流式分析和最终结论，用结构化摘要承接报告证据。"
      terminal-title="diagnostics toolchain"
      :terminal-lines="[
        'tool> find_top_slow_sql',
        'tool> diagnose_slow_query',
        'tool> show_processlist',
        'tool> diagnose_lock_contention',
        'tool> diagnose_connection_spike',
        'tool> diagnose_storage_pressure'
      ]"
      :links="[
        { label: '返回总览', to: '/mcp' },
        { label: '数据查询', to: '/mcp/query' },
        { label: 'TaurusDB 专属能力', to: '/mcp/taurusdb' }
      ]"
    />

    <div class="divider"></div>

    <section class="band">
      <div class="section-inner">
        <div class="demo-grid">
          <ScenarioDemo v-for="scenario in diagnosticsScenarios" :key="scenario.title" :scenario="scenario" />

          <section class="summary-band">
            <article class="card">
              <span class="mode-tag mono">Connection Spike</span>
              <h3>连接堆积</h3>
              <ul class="compact-list">
                <li>`show_processlist` 已抓到大量 `Sleep` 会话。</li>
                <li>`diagnose_connection_spike` 能基于实时快照给出连接堆积结论。</li>
                <li>当前表述限定为“基于 processlist 的实时诊断可用”。</li>
              </ul>
            </article>
            <article class="card">
              <span class="mode-tag mono">Storage Pressure</span>
              <h3>存储压力</h3>
              <ul class="compact-list">
                <li>`diagnose_storage_pressure` 已返回表占用、临时表和疑似 SQL 证据。</li>
                <li>同一结果里同时出现了扫描密集 SQL 与排序/临时表负载。</li>
                <li>这部分更适合作为运维诊断结论卡，而不是原始证据堆叠。</li>
              </ul>
            </article>
          </section>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import ScenarioDemo from "../components/ScenarioDemo.vue";
import HeroSection from "../components/HeroSection.vue";
import { diagnosticsScenarios } from "../data/mcp";
</script>
