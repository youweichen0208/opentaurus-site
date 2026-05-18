<template>
  <div>
    <HeroSection
      eyebrow="Data Query"
      title="先把只读查询和标准执行解释讲清楚"
      description="这一页只保留数据库通用的数据访问问题：怎么安全读取当前数据、怎么用标准 explain 理解查询路径。Flashback Query 和 Enhanced Explain 已放到 TaurusDB 专属能力。"
      terminal-title="query toolchain"
      :terminal-lines="[
        'tool> execute_readonly_sql',
        'tool> explain_sql',
        'tool> list_taurus_features'
      ]"
      :links="[
        { label: '返回总览', to: '/mcp' },
        { label: '运维诊断', to: '/mcp/diagnostics' },
        { label: 'TaurusDB 专属能力', to: '/mcp/taurusdb' }
      ]"
    />

    <div class="divider"></div>

    <section class="band">
      <div class="section-inner">
        <div class="demo-grid">
          <ScenarioDemo v-for="scenario in queryScenarios" :key="scenario.title" :scenario="scenario" />
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import ScenarioDemo from "../components/ScenarioDemo.vue";
import HeroSection from "../components/HeroSection.vue";
import { queryScenarios } from "../data/mcp";
</script>
