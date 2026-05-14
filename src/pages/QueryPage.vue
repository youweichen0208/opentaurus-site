<template>
  <div>
    <HeroSection
      eyebrow="Data Query"
      title="把查询结果、执行解释和历史态对照拆开讲清楚"
      description="这一页不讨论锁和恢复，只聚焦查询本身：怎么读当前数据、怎么解释执行路径、怎么回看历史时刻的数据状态。"
      terminal-title="query toolchain"
      :terminal-lines="[
        'tool> execute_readonly_sql',
        'tool> explain_sql',
        'tool> explain_sql_enhanced',
        'tool> flashback_query',
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
