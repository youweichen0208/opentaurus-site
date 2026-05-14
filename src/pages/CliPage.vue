<template>
  <div>
    <HeroSection
      eyebrow="Companion CLI"
      title="CLI 不是第二个 SQL 客户端"
      description="这一页只讲 companion CLI 在做什么：初始化配置、验证 MCP、执行 smoke、编排 runbook、导出上下文。"
      terminal-title="taurusdb cli"
      :terminal-lines="[
        'taurusdb> mcp smoke --profile prod-ro',
        '✓ server ok',
        '✓ tools/list ok',
        '✓ datasource probe ok'
      ]"
      :links="[
        { label: '返回首页', to: '/' },
        { label: 'MCP', to: '/mcp' }
      ]"
    />

    <div class="divider"></div>

    <section class="band">
      <div class="section-inner">
        <div class="triptych">
          <article class="card">
            <span class="mode-tag mono">Init</span>
            <h3>生成配置</h3>
            <p>面向 Claude、Cursor、VS Code 生成 MCP 配置，降低初次接入成本。</p>
          </article>
          <article class="card">
            <span class="mode-tag mono">Smoke</span>
            <h3>验证链路</h3>
            <p>一条命令验证 server、tools/list、profile 和 capability probe，适合联调与验收。</p>
          </article>
          <article class="card">
            <span class="mode-tag mono">Runbook</span>
            <h3>编排诊断</h3>
            <p>把多次 MCP 调用收束成对人类更友好的报告，而不是要求每个人手工拼命令。</p>
          </article>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import HeroSection from "../components/HeroSection.vue";
</script>
