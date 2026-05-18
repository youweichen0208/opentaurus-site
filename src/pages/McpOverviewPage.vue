<template>
  <div>
    <HeroSection
      eyebrow="MCP Overview"
      title="TaurusDB MCP 的能力地图"
      description="这个站点本身就是 TaurusDB MCP 说明页，入口按客户问题拆开：运维诊断、通用数据查询、TaurusDB 专属能力和 Agent 配置。"
      terminal-title="taurusdb mcp sections"
      :terminal-lines="[
        '1. diagnostics: slow sql / locks / connection / storage',
        '2. query: readonly sql / standard explain',
        '3. native: recycle bin / masking / flashback / enhanced explain / nonblocking ddl',
        'mode: 每页单独承载一类叙事'
      ]"
      :links="[
        { label: '运维诊断', to: '/mcp/diagnostics' },
        { label: '数据查询', to: '/mcp/query' },
        { label: 'TaurusDB 专属能力', to: '/mcp/taurusdb' }
      ]"
    />

    <div class="divider"></div>

    <section class="band">
      <div class="section-inner">
        <div class="section-head">
          <h2>按主题分流</h2>
          <p>总览页只回答“去哪里看什么”。具体的动态输入输出演示，全部下沉到子页面。</p>
        </div>

        <div class="category-grid">
          <CategoryCard
            to="/mcp/diagnostics"
            tag="Ops Diagnostics"
            title="运维诊断"
            description="面向为什么慢、谁在阻塞、连接为什么堆积这类问题，重点展示定位过程。"
            :items="['慢 SQL 命中与根因分析', '锁竞争 blocker / waiter 识别', '连接堆积与存储压力结论']"
          />
          <CategoryCard
            to="/mcp/query"
            tag="Data Access"
            title="数据查询"
            description="面向安全只读访问和标准 explain，不混入 TaurusDB 专属能力。"
            :items="['只读查询上下文', '标准 explain 思路', '查询结果与解释链路']"
          />
          <CategoryCard
            to="/mcp/taurusdb"
            tag="TaurusDB Native"
            title="TaurusDB 专属能力"
            description="面向差异化能力展示，不再混在数据库通用能力里。"
            :items="['Recycle Bin 恢复与 confirmation token', 'Flashback Query 历史态对照', 'Enhanced Explain 专属优化提示']"
          />
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import CategoryCard from "../components/CategoryCard.vue";
import HeroSection from "../components/HeroSection.vue";
</script>
