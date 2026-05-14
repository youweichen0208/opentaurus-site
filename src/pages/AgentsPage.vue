<template>
  <div>
    <HeroSection
      eyebrow="Agent Setup"
      title="把接入文档独立出来"
      description="如何在 Claude、Cursor、VS Code 里接入 MCP，不应该埋在首页底部。它应该是单独页面，面向第一次配置 Agent 的用户。"
      terminal-title="init client config"
      :terminal-lines="[
        'npx> @huaweicloud/taurusdb-mcp init --client claude',
        'adds server: huaweicloud-taurusdb',
        'command: npx -y @huaweicloud/taurusdb-mcp'
      ]"
      :links="[
        { label: '返回首页', to: '/' },
        { label: 'MCP', to: '/mcp' }
      ]"
    />

    <div class="divider"></div>

    <section class="band">
      <div class="section-inner">
        <div class="grid-2">
          <article class="card">
            <span class="mode-tag mono">Claude</span>
            <h3>`init --client claude`</h3>
            <p>默认写入 Claude Desktop 的 MCP 配置，server 名固定为 `huaweicloud-taurusdb`。</p>
          </article>
          <article class="card">
            <span class="mode-tag mono">Cursor / VS Code</span>
            <h3>`init --client cursor|vscode`</h3>
            <p>Cursor 使用 `mcpServers`，VS Code 使用 `servers`，页面里应分别说明。</p>
          </article>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import HeroSection from "../components/HeroSection.vue";
</script>
