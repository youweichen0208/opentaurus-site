<template>
  <section class="section" id="quickstart">
    <div class="section-inner">
      <div class="section-head reveal">
        <div class="eyebrow">QUICK START</div>
        <h2>三步接入 TaurusDB</h2>
        <p class="text-2">从安装到 Agent 连通,5 分钟内完成</p>
      </div>
      <div class="quickstart-grid">
        <div
          v-for="step in steps"
          :key="step.n"
          class="qs-card reveal"
        >
          <div class="qs-step-badge">{{ step.n }}</div>
          <h3>{{ step.title }}</h3>
          <p>{{ step.desc }}</p>
          <pre class="qs-code">{{ step.code }}</pre>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const steps = [
  {
    n: 1,
    title: "安装 MCP Server",
    desc: "通过 npm 全局安装,或直接用 npx 免安装启动",
    code: `npm install -g taurusdb-mcp\n# 或直接使用 npx -y taurusdb-mcp`,
  },
  {
    n: 2,
    title: "配置 Agent",
    desc: "在 Claude Code、Codex 或 Cursor 的 MCP 配置中添加 taurusdb",
    code: `claude mcp add taurusdb \\\n  -- npx -y taurusdb-mcp`,
  },
  {
    n: 3,
    title: "连通 TaurusDB",
    desc: "验证 MCP 是否成功连接云实例和数据库",
    code: `> list_cloud_taurus_instances\n✔ MCP connected (23 tools loaded)`,
  },
];
</script>
