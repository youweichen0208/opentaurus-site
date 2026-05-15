<template>
  <div>
    <HeroSection
      eyebrow="OpenTaurus for TaurusDB"
      title="MCP 工具面 + Agent 接入配置"
      description="为 Claude、Cursor、VS Code 提供 TaurusDB 专属工具面，把云实例诊断、Recycle Bin、Dynamic Masking 等能力接入 Agent 对话流。"
      terminal-title="taurusdb surfaces"
      :terminal-lines="[
        'MCP → diagnostics / flashback / recycle-bin / masking',
        'Agent → claude / cursor / vscode config'
      ]"
      :links="[
        { label: '看 MCP 能力', to: '/mcp' },
        { label: '配置 Agent', to: '/agents' }
      ]"
    />

    <div class="divider"></div>

    <section class="band">
      <div class="section-inner">
        <div class="section-head">
          <h2>按任务选择入口</h2>
          <p>你想了解工具能力、还是配置 Agent 接入？</p>
        </div>

        <div class="grid-2">
          <RouterLink class="card card-link nav-card" to="/mcp">
            <span class="mode-tag mono">MCP</span>
            <h3>工具能力总览</h3>
            <p>diagnostics、Flashback、Recycle Bin、Dynamic Masking、Nonblocking DDL — 每个能力都有场景页和对话演示。</p>
          </RouterLink>

          <RouterLink class="card card-link nav-card" to="/agents">
            <span class="mode-tag mono">Agent Setup</span>
            <h3>Agent 接入配置</h3>
            <p>Claude Code、Cursor、VS Code 的 MCP 接入步骤，一次性把 region + AK/SK 写进配置。</p>
          </RouterLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { RouterLink } from "vue-router";
import HeroSection from "../components/HeroSection.vue";
</script>