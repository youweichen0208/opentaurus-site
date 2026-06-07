<template>
  <section class="hero" id="hero">
    <div class="section-inner">
      <div class="hero-content reveal">
        <div class="eyebrow">NEW &middot; TaurusDB MCP Server v1.0</div>
        <h1>
          让 AI Agent 直接操控<br />
          <span class="gradient-orange">TaurusDB</span>
        </h1>
        <p class="hero-desc">
          通过 MCP 协议,让 Claude Code、Codex、Cursor 等 AI 工具直接查询数据库、诊断性能、执行运维操作。
        </p>
        <div class="btn-row btn-row-center">
          <a href="#quickstart" class="btn btn-primary">快速开始 →</a>
          <a
            href="https://github.com/youweichen0208/taurus-mcp-server"
            target="_blank"
            rel="noopener noreferrer"
            class="btn btn-ghost"
          >GitHub 源码</a>
        </div>
        <div class="hero-terminal">
          <TerminalCard title="terminal">
            <div class="anim-block">
              <div class="anim-msg anim-msg-1">
                <span class="term-prompt">$</span> npx -y taurusdb-mcp
              </div>
              <div class="anim-msg anim-msg-2 term-dim">
                ⠋ 正在启动 MCP Server...
              </div>
              <div class="anim-msg anim-msg-3">
                <span class="term-brand">✔</span>
                MCP Server 已就绪 &mdash;
                <span class="term-warn">port 3000</span>
              </div>
              <div class="anim-msg anim-msg-4 term-dim">
                已注册 23 个工具,3 个资源
              </div>
            </div>
          </TerminalCard>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import TerminalCard from "./TerminalCard.vue";
</script>
