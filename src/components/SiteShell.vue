<template>
  <div>
    <nav class="shell">
      <div class="shell-inner">
        <div class="brand">
          <span class="brand-mark" aria-hidden="true"></span>
          <RouterLink class="brand-name" to="/">OpenTaurus</RouterLink>
        </div>
        <div class="nav-links">
          <RouterLink to="/mcp">MCP</RouterLink>
          <RouterLink to="/agents">Agent 配置</RouterLink>
          <a
            href="https://github.com/youweichen0208/taurus-mcp-server"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </div>
      </div>
    </nav>

    <main>
      <slot />
    </main>

    <footer>
      <div class="footer-inner">
        <div class="footer-copy">
          <strong>OpenTaurus</strong>
          <span>Componentized site scaffold powered by Vite and Vue 3.</span>
        </div>
        <div class="footer-links">
          <RouterLink to="/mcp">MCP</RouterLink>
          <RouterLink to="/agents">Agent 配置</RouterLink>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { RouterLink } from "vue-router";
</script>
