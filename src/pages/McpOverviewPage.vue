<template>
  <div>
    <HeroSection
      eyebrow="MCP Overview"
      title="不要把所有 TaurusDB 故事都塞进一页"
      description="现在改成总览页分流：运维诊断看问题怎么被定位，数据查询看只读访问与解释链路，TaurusDB 专属能力看 recycle bin、dynamic masking、flashback 等差异化能力。"
      terminal-title="opentaurus mcp sections"
      :terminal-lines="[
        '1. diagnostics: slow sql / locks / connection / storage',
        '2. query: readonly sql / explain / flashback',
        '3. taurusdb: recycle bin / masking / nonblocking ddl',
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
            description="面向只读查询、执行计划解释、历史时刻回查这类访问型问题。"
            :items="['只读查询与 explain 思路', 'Flashback Query 历史态对照', '增强 explain 的查询解释']"
          />
          <CategoryCard
            to="/mcp/taurusdb"
            tag="TaurusDB Native"
            title="TaurusDB 专属能力"
            description="面向差异化能力展示，不再混在数据库通用能力里。"
            :items="['Recycle Bin 恢复与 confirmation token', 'Dynamic Masking 双视角对照', '能力探测与专属 feature matrix']"
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
