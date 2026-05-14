<template>
  <div>
    <HeroSection
      eyebrow="TaurusDB Native"
      title="把差异化能力单独讲，不要埋在通用数据库故事里"
      description="这一页只收 TaurusDB 专属能力：feature probe、Recycle Bin、Dynamic Masking 和 Nonblocking DDL。它们和通用的慢 SQL、查询解释不是同一类叙事。"
      terminal-title="taurusdb native tools"
      :terminal-lines="[
        'tool> list_taurus_features',
        'tool> list_recycle_bin',
        'tool> restore_recycle_bin_table',
        'tool> execute_readonly_sql',
        'focus: taurusdb-only capabilities'
      ]"
      :links="[
        { label: '返回总览', to: '/mcp' },
        { label: '运维诊断', to: '/mcp/diagnostics' },
        { label: '数据查询', to: '/mcp/query' }
      ]"
    />

    <div class="divider"></div>

    <section class="band">
      <div class="section-inner">
        <div class="demo-grid">
          <ScenarioDemo v-for="scenario in taurusScenarios" :key="scenario.title" :scenario="scenario" />

          <section class="summary-band">
            <article class="card">
              <span class="mode-tag mono">Feature Probe</span>
              <h3>能力探测</h3>
              <ul class="compact-list">
                <li>`list_taurus_features` 已识别真实 TaurusDB 实例。</li>
                <li>内核版本 `8.0.22`，MySQL 兼容版本 `8.0`。</li>
                <li>`flashback_query`、`recycle_bin`、`dynamic_masking`、`nonblocking_ddl` 都已看到可用。</li>
              </ul>
            </article>
            <article class="card">
              <span class="mode-tag mono">Nonblocking DDL</span>
              <h3>基础行为验证</h3>
              <ul class="compact-list">
                <li>`nonblocking_ddl` 已在能力探测中可见。</li>
                <li>DDL 执行期间，并发查询仍能正常返回。</li>
                <li>这类能力适合放在专属能力页做收口，而不是混在事故排查页。</li>
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
import { taurusScenarios } from "../data/mcp";
</script>
