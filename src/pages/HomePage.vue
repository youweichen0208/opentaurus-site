<template>
  <div>
    <HeroSection
      eyebrow="OpenTaurus for TaurusDB"
      title="不要把所有故事塞进一个页面"
      description="首页只回答三件事：OpenTaurus 是什么、有哪些入口、该从哪里开始。真实能力展示、命令示例、云端证据和 Agent 配置，分别进入独立板块。"
      terminal-title="opentaurus surfaces"
      :terminal-lines="[
        '1. MCP: 给 Claude / Cursor / VS Code 的工具面',
        '2. MCP 内含 Cloud evidence: CES / DAS / 实例解析',
        '3. CLI: init / smoke / runbook / context export',
        '4. Agents: Claude、Cursor、VS Code 接入方式'
      ]"
      :links="[
        { label: '看 MCP 能力', to: '/mcp' },
        { label: '看 Agent 配置', to: '/agents' }
      ]"
    />

    <div class="divider"></div>

    <section class="band">
      <div class="section-inner">
        <div class="section-head">
          <h2>按任务进入，而不是按实现堆叠</h2>
          <p>不同访问者关心的不是同一个页面里所有模块，而是自己现在要完成哪件事。</p>
        </div>

        <div class="grid-2">
          <article class="card nav-card">
            <span class="mode-tag mono">MCP</span>
            <h3>工具能力展示</h3>
            <p>现在已经收进真实云端测试报告，展示 diagnostics、Flashback、Recycle Bin、Dynamic Masking 等能力与截图证据。</p>
            <RouterLink class="text-link" to="/mcp">进入 MCP 页面</RouterLink>
          </article>

          <article class="card nav-card">
            <span class="mode-tag mono">CLI</span>
            <h3>命令入口与 runbook</h3>
            <p>突出 `init`、`smoke`、`mcp call`、`runbook`，说明 CLI 是 companion，不是第二个 SQL 客户端。</p>
            <RouterLink class="text-link" to="/cli">进入 CLI 页面</RouterLink>
          </article>

          <article class="card nav-card">
            <span class="mode-tag mono">Agent Setup</span>
            <h3>Claude / Cursor / VS Code 配置</h3>
            <p>把“如何在 Agent 中接入 MCP”变成独立入口，避免和能力展示混在一起。</p>
            <RouterLink class="text-link" to="/agents">进入配置页面</RouterLink>
          </article>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { RouterLink } from "vue-router";
import HeroSection from "../components/HeroSection.vue";
</script>
