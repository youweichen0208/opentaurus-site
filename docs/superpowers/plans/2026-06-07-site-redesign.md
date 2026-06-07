# OpenTaurus Site Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the OpenTaurus site as a single-page scroll narrative with Tavily-style deep-blue dark theme, animated terminal demos, and Tab-switched agent configuration.

**Architecture:** Single-page Vue 3 SPA. The home page (`/`) is the full scroll narrative with 7 sections. Legacy routes redirect to anchors via `router.replace`. All demo animations are pure CSS (keyframes + `IntersectionObserver` for scroll-triggered entry). Data files retain their structure; the plan adapts `src/data/agentSetup.js` to a tab-friendly format.

**Tech Stack:** Vue 3 + Vite + vue-router (already installed). No new runtime dependencies. CSS variables drive the design system — all style changes are centralized in `site.css`.

---

## File Structure

```
src/
  styles/site.css              ← REWRITE (all new design tokens + components)
  components/
    SiteShell.vue              ← MODIFY (scroll-tracking nav, anchor links)
    HeroSection.vue            ← REWRITE (deep-blue hero + install terminal)
    QuickStartCards.vue        ← CREATE (3-step quickstart grid)
    DemoSection.vue            ← CREATE (generic left-copy / right-terminal)
    AnimatedTerminal.vue       ← CREATE (CSS animation sequence wrapper)
    TerminalCard.vue           ← CREATE (reusable terminal chrome + body slot)
    AgentTabs.vue              ← CREATE (tab switcher + per-agent terminal)
  pages/
    HomePage.vue               ← REWRITE (assembles all 7 sections)
  data/
    agentSetup.js              ← MODIFY (add Claude Code tab data)
  router/index.js              ← REWRITE (single route + legacy redirects)

  DELETE after migration:
    src/pages/McpOverviewPage.vue
    src/pages/DiagnosticsPage.vue
    src/pages/QueryPage.vue
    src/pages/TaurusNativePage.vue
    src/pages/TaurusNativeScenarioPage.vue
    src/pages/AgentsPage.vue
    src/pages/AgentSetupPage.vue
    src/components/CategoryCard.vue
    src/components/ScenarioDemo.vue
    src/components/OutputCard.vue
```

---

## Task 1: Rewrite `site.css` with new design tokens

**Files:** `src/styles/site.css` (full rewrite)

This task replaces the entire stylesheet. All subsequent component code assumes these tokens exist.

```css
/* src/styles/site.css */

:root {
  --bg-1: #0f1a2e;
  --bg-2: #0b1624;
  --bg: linear-gradient(180deg, var(--bg-1), var(--bg-2));
  --bg-solid: #0d1829;
  --surface: rgba(255, 255, 255, 0.04);
  --surface-raised: rgba(255, 255, 255, 0.07);
  --surface-solid: #111d35;
  --border: rgba(255, 255, 255, 0.08);
  --border-strong: rgba(255, 255, 255, 0.14);
  --text: #fafafa;
  --text-2: rgba(255, 255, 255, 0.55);
  --text-3: rgba(255, 255, 255, 0.35);
  --brand: #f97316;
  --brand-2: #fb923c;
  --brand-glow: rgba(249, 115, 22, 0.25);
  --brand-bg: rgba(249, 115, 22, 0.12);
  --accent: #3b82f6;
  --accent-bg: rgba(59, 130, 246, 0.12);
  --success: #22c55e;
  --success-bg: rgba(34, 197, 94, 0.08);
  --warning: #fbbf24;
  --hero-glow: rgba(59, 130, 246, 0.1);
  --brand-glow-radial: rgba(249, 115, 22, 0.14);
  --terminal: #0c0c10;
  --terminal-text: rgba(255, 255, 255, 0.78);
  --shadow-card: 0 8px 32px rgba(0, 0, 0, 0.3);
  --shadow-terminal: 0 24px 80px rgba(0, 0, 0, 0.45);
  --shadow-btn: 0 0 0 1px rgba(249, 115, 22, 0.2), 0 0 24px rgba(249, 115, 22, 0.18);
  --max: 1140px;
  --radius: 16px;
  --radius-sm: 10px;
  --radius-pill: 999px;
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

html { scroll-behavior: smooth; scroll-padding-top: 72px; }

body {
  background: var(--bg);
  background-attachment: fixed;
  color: var(--text);
  font-family: Inter, "PingFang SC", "Noto Sans SC", sans-serif;
  font-size: 1rem;
  line-height: 1.6;
  min-height: 100vh;
}

a { color: inherit; text-decoration: none; }

.mono, code, pre {
  font-family: "JetBrains Mono", "SF Mono", Consolas, monospace;
}

/* ── NAV SHELL ── */
.shell {
  position: sticky;
  top: 0;
  z-index: 50;
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  background: rgba(13, 24, 41, 0.78);
  border-bottom: 1px solid var(--border);
}

.shell-inner {
  width: min(var(--max), calc(100vw - 48px));
  margin: 0 auto;
  min-height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
}

.brand-dot {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: linear-gradient(135deg, var(--brand), #ea580c);
  box-shadow: 0 0 0 4px rgba(249, 115, 22, 0.15);
}

.brand-name {
  font-size: 1rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: var(--text);
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.nav-links a {
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  border-radius: var(--radius-sm);
  font-size: 0.88rem;
  font-weight: 500;
  color: var(--text-2);
  transition: color 0.15s, background 0.15s;
}

.nav-links a:hover { color: var(--text); background: var(--surface); }

.nav-links a.is-active {
  color: var(--brand);
  background: var(--brand-bg);
}

.nav-links a.is-external {
  color: var(--text-3);
  font-size: 0.82rem;
}

/* ── SECTION LAYOUT ── */
.section {
  padding: clamp(72px, 12vw, 120px) 0 clamp(48px, 8vw, 80px);
  position: relative;
}

.section-inner {
  width: min(var(--max), calc(100vw - 48px));
  margin: 0 auto;
}

.section-head {
  text-align: center;
  max-width: 620px;
  margin: 0 auto 56px;
}

.eyebrow {
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: var(--radius-pill);
  background: var(--brand-bg);
  border: 1px solid rgba(249, 115, 22, 0.2);
  color: var(--brand);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  margin-bottom: 16px;
}

h1, h2, h3 { letter-spacing: -0.035em; font-weight: 700; }

h1 {
  font-size: clamp(3rem, 7vw, 5rem);
  font-weight: 800;
  line-height: 1.05;
  letter-spacing: -0.045em;
}

h2 {
  font-size: clamp(1.8rem, 4vw, 2.8rem);
  line-height: 1.1;
  margin-bottom: 12px;
}

h3 { font-size: 1.25rem; line-height: 1.2; }

.text-2 { color: var(--text-2); }
.text-3 { color: var(--text-3); }

.gradient-orange {
  background: linear-gradient(135deg, var(--brand), var(--brand-2));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* ── BUTTONS ── */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 11px 22px;
  border-radius: var(--radius-sm);
  font-size: 0.92rem;
  font-weight: 700;
  cursor: pointer;
  border: none;
  transition: transform 0.12s, box-shadow 0.12s;
  text-decoration: none;
}

.btn:active { transform: scale(0.98); }

.btn-primary {
  background: var(--brand);
  color: #fff;
  box-shadow: var(--shadow-btn);
}

.btn-primary:hover {
  box-shadow: 0 0 0 1px rgba(249, 115, 22, 0.4), 0 0 40px rgba(249, 115, 22, 0.3);
}

.btn-ghost {
  background: var(--surface);
  color: var(--text-2);
  border: 1px solid var(--border);
}

.btn-ghost:hover { color: var(--text); border-color: var(--border-strong); }

.btn-row { display: flex; gap: 12px; flex-wrap: wrap; }
.btn-row-center { justify-content: center; }

/* ── TERMINAL CARD ── */
.terminal {
  border-radius: var(--radius);
  background: var(--terminal);
  border: 1px solid var(--border);
  box-shadow: var(--shadow-terminal);
  overflow: hidden;
}

.terminal-head {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border-bottom: 1px solid var(--border);
  background: rgba(255, 255, 255, 0.025);
}

.dots { display: flex; gap: 6px; }

.dot {
  width: 11px;
  height: 11px;
  border-radius: 999px;
  flex-shrink: 0;
}

.dot-r { background: #ff5f57; }
.dot-y { background: #febc2e; }
.dot-g { background: #28c840; }

.terminal-title {
  margin-left: auto;
  color: var(--text-3);
  font-size: 0.74rem;
  font-family: "JetBrains Mono", monospace;
}

.terminal-body {
  padding: 18px 20px;
  font-family: "JetBrains Mono", monospace;
  font-size: 0.82rem;
  line-height: 1.75;
  color: var(--terminal-text);
}

.term-prompt { color: var(--success); }
.term-dim    { color: var(--text-3); }
.term-brand  { color: var(--brand); }
.term-warn   { color: var(--warning); }
.term-info   { color: var(--accent); }

/* ── HERO ── */
.hero {
  padding: clamp(80px, 14vw, 140px) 0 clamp(60px, 10vw, 100px);
  text-align: center;
  position: relative;
  overflow: hidden;
}

.hero::before {
  content: "";
  position: absolute;
  top: -30vw;
  left: 50%;
  transform: translateX(-50%);
  width: 80vw;
  height: 80vw;
  max-width: 900px;
  max-height: 900px;
  background: radial-gradient(circle, var(--hero-glow), transparent 70%);
  pointer-events: none;
}

.hero-content {
  max-width: 720px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.hero h1 { margin-bottom: 20px; }

.hero-desc {
  color: var(--text-2);
  font-size: 1.12rem;
  line-height: 1.6;
  margin-bottom: 32px;
  max-width: 560px;
  margin-left: auto;
  margin-right: auto;
}

.hero-terminal {
  max-width: 520px;
  margin: 40px auto 0;
}

/* ── QUICK START CARDS ── */
.quickstart-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
}

.qs-card {
  padding: 24px;
  border-radius: var(--radius);
  background: var(--surface);
  border: 1px solid var(--border);
  box-shadow: var(--shadow-card);
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.qs-step-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 8px;
  border: 1.5px solid var(--brand);
  color: var(--brand);
  font-size: 0.82rem;
  font-weight: 800;
  flex-shrink: 0;
}

.qs-card h3 { margin: 0; }

.qs-card p { color: var(--text-2); font-size: 0.92rem; line-height: 1.55; }

.qs-code {
  padding: 10px 14px;
  border-radius: var(--radius-sm);
  background: var(--terminal);
  border: 1px solid var(--border);
  font-family: "JetBrains Mono", monospace;
  font-size: 0.78rem;
  color: var(--terminal-text);
  line-height: 1.7;
  overflow-x: auto;
  white-space: pre;
}

/* ── DEMO SECTION (left copy, right terminal) ── */
.demo-grid {
  display: grid;
  grid-template-columns: 1fr 1.25fr;
  gap: 32px;
  align-items: center;
}

.demo-copy {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.demo-features {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.demo-features li {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--text-2);
  font-size: 0.92rem;
}

.demo-features li::before {
  content: "";
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: var(--success);
  flex-shrink: 0;
}

/* ── AGENT TABS ── */
.tab-bar {
  display: inline-flex;
  gap: 4px;
  padding: 4px;
  border-radius: var(--radius-sm);
  background: var(--surface);
  border: 1px solid var(--border);
  margin-bottom: 24px;
}

.tab-btn {
  padding: 8px 20px;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  border: none;
  background: transparent;
  color: var(--text-2);
  transition: all 0.12s;
}

.tab-btn:hover { color: var(--text); }

.tab-btn.is-active {
  background: var(--brand-bg);
  color: var(--brand);
  border: 1px solid rgba(249, 115, 22, 0.25);
}

/* ── ANIMATED TERMINAL MESSAGES ── */
.anim-block {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.anim-msg {
  opacity: 0;
  transform: translateY(8px);
  animation: animFadeUp 8s ease-out infinite;
}

.anim-msg-1 { animation-delay: 0.2s; }
.anim-msg-2 { animation-delay: 1.0s; }
.anim-msg-3 { animation-delay: 2.0s; }
.anim-msg-4 { animation-delay: 3.0s; }
.anim-msg-5 { animation-delay: 4.2s; }
.anim-msg-6 { animation-delay: 5.2s; }

@keyframes animFadeUp {
  0%  { opacity: 0; transform: translateY(8px); }
  6%, 100% { opacity: 1; transform: translateY(0); }
}

/* Chat rows */
.chat-row {
  display: flex;
  gap: 10px;
  align-items: flex-start;
}

.chat-row-user { justify-content: flex-end; }

.chat-bubble {
  max-width: 85%;
  padding: 10px 14px;
  border-radius: 14px;
  font-size: 0.88rem;
  line-height: 1.55;
  font-family: Inter, sans-serif;
}

.chat-row-user .chat-bubble {
  background: var(--surface-raised);
  border: 1px solid var(--border);
  border-bottom-right-radius: 4px;
  color: var(--text);
}

.chat-row-agent .chat-bubble {
  background: var(--surface);
  border: 1px solid var(--border);
  border-bottom-left-radius: 4px;
  color: var(--text-2);
}

/* Tool call block */
.tool-call {
  padding: 6px 14px;
  border-left: 2px solid rgba(249, 115, 22, 0.35);
  margin-left: 4px;
  font-family: "JetBrains Mono", monospace;
  font-size: 0.8rem;
  line-height: 1.7;
}

.tool-call-name { color: var(--accent); font-weight: 600; }
.tool-call-args { color: var(--text-3); }

/* Tool result */
.tool-result {
  padding: 8px 14px;
  border-radius: 8px;
  background: var(--success-bg);
  border: 1px solid rgba(34, 197, 94, 0.18);
  color: var(--success);
  font-size: 0.8rem;
  line-height: 1.5;
  font-family: "JetBrains Mono", monospace;
}

.tool-result::before { content: "✔ "; }

/* ── DIVIDER ── */
.divider {
  width: min(var(--max), calc(100vw - 48px));
  height: 1px;
  margin: 0 auto;
  background: var(--border);
}

/* ── FOOTER ── */
.footer {
  border-top: 1px solid var(--border);
  padding: 60px 0 28px;
  position: relative;
}

.footer::before {
  content: "";
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 60vw;
  height: 300px;
  background: radial-gradient(ellipse, var(--hero-glow), transparent 70%);
  pointer-events: none;
}

.footer-inner {
  width: min(var(--max), calc(100vw - 48px));
  margin: 0 auto;
  position: relative;
}

.footer-cta {
  text-align: center;
  margin-bottom: 48px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.footer-cta h2 { margin-bottom: 4px; }

.footer-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding-top: 20px;
  border-top: 1px solid var(--border);
  flex-wrap: wrap;
}

.footer-copy { color: var(--text-3); font-size: 0.85rem; }

.footer-links {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.footer-links a {
  color: var(--text-3);
  font-size: 0.85rem;
  transition: color 0.12s;
}

.footer-links a:hover { color: var(--text-2); }

/* ── REVEAL ON SCROLL ── */
.reveal {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.5s ease-out, transform 0.5s ease-out;
}

.reveal.is-visible {
  opacity: 1;
  transform: translateY(0);
}

/* ── RESPONSIVE ── */
@media (max-width: 920px) {
  .demo-grid { grid-template-columns: 1fr; }
  .demo-copy { max-width: 620px; }
}

@media (max-width: 720px) {
  .shell-inner { padding: 10px 0; }
  .nav-links { gap: 2px; }
  .nav-links a { padding: 5px 8px; font-size: 0.82rem; }
  h1 { font-size: clamp(2.4rem, 9vw, 3.5rem); }
  .terminal-body { font-size: 0.76rem; }
}

@media (max-width: 520px) {
  .quickstart-grid { grid-template-columns: 1fr; }
  .tab-bar { flex-wrap: wrap; }
  .btn-row { flex-direction: column; align-items: stretch; }
}
```

- [ ] **Step 1: Replace `site.css` entirely**

Write the full CSS above to `src/styles/site.css`, replacing all existing content.

- [ ] **Step 2: Run dev server to verify no syntax errors**

```bash
npm run dev
```

Expected: Vite starts without build errors; browser shows unstyled content (expected since components still use old classes).

- [ ] **Step 3: Commit**

```bash
git add src/styles/site.css
git commit -m "style: rewrite site.css with Tavily-style deep-blue dark design system"
```

---

## Task 2: Create `TerminalCard.vue`

A reusable terminal chrome wrapper used by every section.

**Files:** Create `src/components/TerminalCard.vue`

```vue
<!-- src/components/TerminalCard.vue -->
<template>
  <div class="terminal">
    <div class="terminal-head">
      <div class="dots">
        <span class="dot dot-r"></span>
        <span class="dot dot-y"></span>
        <span class="dot dot-g"></span>
      </div>
      <span v-if="title" class="terminal-title">{{ title }}</span>
    </div>
    <div class="terminal-body">
      <slot />
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, default: "" }
})
```

- [ ] **Step 1: Create file**

Write the above code to `src/components/TerminalCard.vue`.

- [ ] **Step 2: Commit**

```bash
git add src/components/TerminalCard.vue
git commit -m "feat: add TerminalCard component"
```

---

## Task 3: Rewrite `HeroSection.vue`

**Files:** `src/components/HeroSection.vue` (full rewrite)

```vue
<!-- src/components/HeroSection.vue -->
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
          通过 MCP 协议，让 Claude Code、Codex、Cursor 等 AI 工具直接查询数据库、诊断性能、执行运维操作。
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
                已注册 23 个工具，3 个资源
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
```

- [ ] **Step 1: Rewrite HeroSection**

Replace all content in `src/components/HeroSection.vue` with the code above.

- [ ] **Step 2: Commit**

```bash
git add src/components/HeroSection.vue
git commit -m "feat: rewrite HeroSection with deep-blue hero and animated install terminal"
```

---

## Task 4: Create `QuickStartCards.vue`

**Files:** Create `src/components/QuickStartCards.vue`

```vue
<!-- src/components/QuickStartCards.vue -->
<template>
  <section class="section" id="quickstart">
    <div class="section-inner">
      <div class="section-head reveal">
        <div class="eyebrow">QUICK START</div>
        <h2>三步接入 TaurusDB</h2>
        <p class="text-2">从安装到 Agent 连通，5 分钟内完成</p>
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
    desc: "通过 npm 全局安装，或直接用 npx 免安装启动",
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
```

- [ ] **Step 1: Create file**

Write above code to `src/components/QuickStartCards.vue`.

- [ ] **Step 2: Commit**

```bash
git add src/components/QuickStartCards.vue
git commit -m "feat: add QuickStartCards component"
```

---

## Task 5: Create `AnimatedTerminal.vue`

A wrapper that animates child `.anim-msg` elements. Used as the right-hand panel in `DemoSection`.

**Files:** Create `src/components/AnimatedTerminal.vue`

```vue
<!-- src/components/AnimatedTerminal.vue -->
<template>
  <TerminalCard :title="agentTitle">
    <div class="anim-block">
      <slot />
    </div>
  </TerminalCard>
</template>

<script setup>
import TerminalCard from "./TerminalCard.vue";
defineProps({
  agentTitle: { type: String, default: "Claude Code + taurusdb-mcp" }
});
</script>
```

- [ ] **Step 1: Create file**

Write above code to `src/components/AnimatedTerminal.vue`.

- [ ] **Step 2: Commit**

```bash
git add src/components/AnimatedTerminal.vue
git commit -m "feat: add AnimatedTerminal component"
```

---

## Task 6: Create `DemoSection.vue`

Generic left-copy / right-terminal demo layout.

**Files:** Create `src/components/DemoSection.vue`

```vue
<!-- src/components/DemoSection.vue -->
<template>
  <section class="section" :id="anchor">
    <div class="section-inner">
      <div class="demo-grid reveal">
        <div class="demo-copy">
          <div v-if="tag" class="eyebrow">{{ tag }}</div>
          <h2 v-html="title"></h2>
          <p class="text-2">{{ description }}</p>
          <ul v-if="features?.length" class="demo-features">
            <li v-for="f in features" :key="f">{{ f }}</li>
          </ul>
        </div>
        <div>
          <slot name="terminal" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  anchor: { type: String, required: true },
  tag: { type: String, default: "" },
  title: { type: String, required: true },
  description: { type: String, default: "" },
  features: { type: Array, default: () => [] },
});
</script>
```

- [ ] **Step 1: Create file**

Write above code to `src/components/DemoSection.vue`.

- [ ] **Step 2: Commit**

```bash
git add src/components/DemoSection.vue
git commit -m "feat: add DemoSection component"
```

---

## Task 7: Create `AgentTabs.vue`

Tabbed terminal showing Claude Code / Codex / Cursor setup steps.

**Files:** Create `src/components/AgentTabs.vue`

Also creates a new data file `src/data/agentTabs.js` that contains Claude Code setup (currently missing from `agentSetup.js`) and adapts Codex + Cursor data to the tab format.

```js
// src/data/agentTabs.js

export const agentTabs = [
  {
    id: "claude",
    label: "Claude Code",
    steps: [
      {
        label: "1. 安装 MCP Server",
        command: "$ npm install -g taurusdb-mcp",
      },
      {
        label: "2. 添加 MCP 到 Claude",
        command: `$ claude mcp add taurusdb \\
  --env TAURUSDB_CLOUD_REGION=<your-region> \\
  --env TAURUSDB_CLOUD_ACCESS_KEY_ID=<your-ak> \\
  --env TAURUSDB_CLOUD_SECRET_ACCESS_KEY=<your-sk> \\
  -- npx -y taurusdb-mcp`,
      },
      {
        label: "3. 验证连通",
        command: `$ claude
> /mcp
✔ taurusdb connected (23 tools loaded)`,
      },
    ],
  },
  {
    id: "codex",
    label: "Codex",
    steps: [
      {
        label: "1. 安装 MCP Server",
        command: "$ npm install -g taurusdb-mcp",
      },
      {
        label: "2. 通过 Codex CLI 添加",
        command: `$ codex mcp add taurusdb \\
  --env TAURUSDB_CLOUD_REGION=<your-region> \\
  --env TAURUSDB_CLOUD_ACCESS_KEY_ID=<your-ak> \\
  --env TAURUSDB_CLOUD_SECRET_ACCESS_KEY=<your-sk> \\
  -- npx -y taurusdb-mcp`,
      },
      {
        label: "3. 验证连通",
        command: `$ codex mcp list
✔ taurusdb registered
> list_cloud_taurus_instances
✔ Instance list returned`,
      },
    ],
  },
  {
    id: "cursor",
    label: "Cursor",
    steps: [
      {
        label: "1. 安装 MCP Server",
        command: "$ npm install -g taurusdb-mcp",
      },
      {
        label: "2. 编辑 ~/.cursor/mcp.json",
        command: `{
  "mcpServers": {
    "taurusdb": {
      "command": "npx",
      "args": ["-y", "taurusdb-mcp"],
      "env": {
        "TAURUSDB_CLOUD_REGION": "<your-region>",
        "TAURUSDB_CLOUD_ACCESS_KEY_ID": "<your-ak>",
        "TAURUSDB_CLOUD_SECRET_ACCESS_KEY": "<your-sk>"
      }
    }
  }
}`,
      },
      {
        label: "3. 重启 Cursor 并验证",
        command: `重启 Cursor → Agent 模式 → 输入:
> list_cloud_taurus_instances
✔ Instance list returned`,
      },
    ],
  },
];
```

```vue
<!-- src/components/AgentTabs.vue -->
<template>
  <section class="section" id="agents">
    <div class="section-inner">
      <div class="section-head reveal">
        <div class="eyebrow">AGENT SETUP</div>
        <h2>选择你的 Agent</h2>
        <p class="text-2">三种主流 AI 工具，同一套 MCP Server，一键接入</p>
      </div>

      <div class="reveal">
        <div class="tab-bar">
          <button
            v-for="tab in agentTabs"
            :key="tab.id"
            class="tab-btn"
            :class="{ 'is-active': activeId === tab.id }"
            @click="activeId = tab.id"
          >
            {{ tab.label }}
          </button>
        </div>

        <TerminalCard title="agent setup">
          <div
            v-for="step in activeTab.steps"
            :key="step.label"
            style="margin-bottom: 18px"
          >
            <div class="term-dim" style="font-size: 0.74rem; margin-bottom: 6px">
              {{ step.label }}
            </div>
            <pre class="qs-code" style="white-space: pre-wrap">{{ step.command }}</pre>
          </div>
        </TerminalCard>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from "vue";
import TerminalCard from "./TerminalCard.vue";
import { agentTabs } from "../data/agentTabs";

const activeId = ref("claude");
const activeTab = computed(() => agentTabs.find((t) => t.id === activeId.value));
</script>
```

- [ ] **Step 1: Create `agentTabs.js` data file**

Write the `agentTabs.js` code above.

- [ ] **Step 2: Create `AgentTabs.vue`**

Write the `AgentTabs.vue` code above.

- [ ] **Step 3: Commit**

```bash
git add src/data/agentTabs.js src/components/AgentTabs.vue
git commit -m "feat: add AgentTabs component with Claude/Codex/Cursor setup data"
```

---

## Task 8: Rewrite `HomePage.vue`

Assemble all 7 sections into a single scroll narrative.

**Files:** `src/pages/HomePage.vue` (full rewrite)

```vue
<!-- src/pages/HomePage.vue -->
<template>
  <div>
    <HeroSection />

    <div class="divider"></div>

    <QuickStartCards />

    <div class="divider"></div>

    <DemoSection
      anchor="diagnostics"
      tag="运维诊断"
      title="一句话诊断<br />数据库异常"
      description="让 AI Agent 自动分析慢查询、锁等待、资源瓶颈，直接给出根因和优化建议。"
      :features="[
        '慢查询分析与索引优化建议',
        '锁等待与死锁检测，定位 blocker',
        '实例资源使用趋势监控',
        '参数配置自动巡检',
      ]"
    >
      <template #terminal>
        <AnimatedTerminal agentTitle="Claude Code + taurusdb-mcp">
          <div class="chat-row chat-row-user anim-msg anim-msg-1">
            <div class="chat-bubble">帮我分析一下最近的慢查询</div>
          </div>
          <div class="chat-row chat-row-agent anim-msg anim-msg-2">
            <div class="chat-bubble">好的，我来查询 TaurusDB 最近的慢查询统计...</div>
          </div>
          <div class="anim-msg anim-msg-3">
            <div class="tool-call">
              <span class="tool-call-name">query_slow_queries</span><span class="tool-call-args">({ timeRange: "24h", limit: 10 })</span>
            </div>
          </div>
          <div class="anim-msg anim-msg-4">
            <div class="tool-result">找到 3 条慢查询，最长执行时间 12.4s，涉及 rows_examined 25 万行</div>
          </div>
          <div class="chat-row chat-row-agent anim-msg anim-msg-5">
            <div class="chat-bubble">
              分析完毕。最可疑 SQL 命中 <code>t_orders_test</code> 表，<br />
              缺少 <code>order_date</code> 索引，建议添加复合索引：<br />
              <code style="color:#f97316">INDEX idx_order_date_status (order_date, status)</code>
            </div>
          </div>
        </AnimatedTerminal>
      </template>
    </DemoSection>

    <div class="divider"></div>

    <DemoSection
      anchor="query"
      tag="数据查询"
      title="自然语言<br />直接查数据"
      description="用自然语言提问，AI 自动生成 SQL 并执行，结果直接可视化呈现。"
      :features="[
        '自然语言转精准 SQL',
        '多表 JOIN 关联查询',
        '结果自动表格化展示',
        '查询计划自动优化建议',
      ]"
    >
      <template #terminal>
        <AnimatedTerminal agentTitle="Codex + taurusdb-mcp">
          <div class="chat-row chat-row-user anim-msg anim-msg-1">
            <div class="chat-bubble">查一下最近 7 天订单最多的前 10 个城市</div>
          </div>
          <div class="chat-row chat-row-agent anim-msg anim-msg-2">
            <div class="chat-bubble">我来查询最近 7 天的订单数据...</div>
          </div>
          <div class="anim-msg anim-msg-3">
            <div class="tool-call">
              <span class="tool-call-name">execute_readonly_sql</span><span class="tool-call-args">(sql: "SELECT city, COUNT(*) FROM orders WHERE ...")</span>
            </div>
          </div>
          <div class="anim-msg anim-msg-4">
            <div class="tool-result">查询返回 10 行，耗时 0.042s</div>
          </div>
          <div class="chat-row chat-row-agent anim-msg anim-msg-5">
            <div class="chat-bubble">
              查询完成：<br />
              🥇 上海 — 12,840 单<br />
              🥈 北京 — 11,203 单<br />
              🥉 深圳 — 9,776 单
            </div>
          </div>
        </AnimatedTerminal>
      </template>
    </DemoSection>

    <div class="divider"></div>

    <DemoSection
      anchor="taurusdb"
      tag="专属能力"
      title="发挥 TaurusDB<br />的独有价值"
      description="Recycle Bin、Dynamic Masking、Nonblocking DDL、Flashback Query —— TaurusDB 的原生能力通过 MCP 无缝对接 AI Agent。"
      :features="[
        'Recycle Bin：误删表秒级恢复',
        'Dynamic Masking：敏感字段按身份动态脱敏',
        'Nonblocking DDL：在线加列不阻断读流量',
        'Flashback Query：按时间点回查历史数据',
      ]"
    >
      <template #terminal>
        <AnimatedTerminal agentTitle="Cursor + taurusdb-mcp">
          <div class="chat-row chat-row-user anim-msg anim-msg-1">
            <div class="chat-bubble">t_recycle_bin_test 表不见了，帮我恢复</div>
          </div>
          <div class="anim-msg anim-msg-2">
            <div class="tool-call">
              <span class="tool-call-name">list_recycle_bin</span><span class="tool-call-args">()</span>
            </div>
          </div>
          <div class="anim-msg anim-msg-3">
            <div class="tool-result">回收站中找到 t_recycle_bin_test，删除时间 2026-05-13 10:35:00</div>
          </div>
          <div class="chat-row chat-row-agent anim-msg anim-msg-4">
            <div class="chat-bubble">
              恢复操作需要二次确认。<br />
              确认恢复该表吗？回复「确认」执行。
            </div>
          </div>
          <div class="chat-row chat-row-user anim-msg anim-msg-5">
            <div class="chat-bubble">确认</div>
          </div>
          <div class="anim-msg anim-msg-6">
            <div class="tool-result">✔ 表 t_recycle_bin_test 恢复成功，3 rows recovered</div>
          </div>
        </AnimatedTerminal>
      </template>
    </DemoSection>

    <div class="divider"></div>

    <AgentTabs />

    <div class="divider"></div>

    <footer class="footer">
      <div class="footer-inner">
        <div class="footer-cta reveal">
          <h2>开始使用 OpenTaurus</h2>
          <p class="text-2">5 分钟内完成接入，让 AI 真正操控你的数据库</p>
          <div class="btn-row btn-row-center">
            <a href="#quickstart" class="btn btn-primary">快速开始 →</a>
            <a
              href="https://github.com/youweichen0208/taurus-mcp-server"
              target="_blank"
              rel="noopener noreferrer"
              class="btn btn-ghost"
            >GitHub</a>
          </div>
        </div>
        <div class="footer-bar">
          <div class="footer-copy">
            <strong>OpenTaurus</strong>
            <span class="text-3">· Powered by Vite + Vue 3</span>
          </div>
          <div class="footer-links">
            <a
              href="https://github.com/youweichen0208/taurus-mcp-server"
              target="_blank"
              rel="noopener noreferrer"
            >GitHub</a>
            <span class="text-3">MIT License</span>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import HeroSection from "../components/HeroSection.vue";
import QuickStartCards from "../components/QuickStartCards.vue";
import DemoSection from "../components/DemoSection.vue";
import AnimatedTerminal from "../components/AnimatedTerminal.vue";
import AgentTabs from "../components/AgentTabs.vue";
</script>
```

- [ ] **Step 1: Rewrite HomePage**

Replace all content in `src/pages/HomePage.vue` with the code above.

- [ ] **Step 2: Commit**

```bash
git add src/pages/HomePage.vue
git commit -m "feat: rewrite HomePage as single-page scroll narrative"
```

---

## Task 9: Update `SiteShell.vue` with scroll-tracking nav

**Files:** `src/components/SiteShell.vue` (rewrite)

```vue
<!-- src/components/SiteShell.vue -->
<template>
  <div>
    <nav class="shell">
      <div class="shell-inner">
        <div class="brand">
          <span class="brand-dot" aria-hidden="true"></span>
          <RouterLink class="brand-name" to="/">OpenTaurus</RouterLink>
        </div>
        <div class="nav-links">
          <a
            v-for="item in navItems"
            :key="item.href"
            :href="item.href"
            :class="{ 'is-active': activeSection === item.id, 'is-external': item.external }"
            :target="item.external ? '_blank' : undefined"
            :rel="item.external ? 'noopener noreferrer' : undefined"
            @click.prevent="scrollTo(item.id)"
          >
            {{ item.label }}
          </a>
        </div>
      </div>
    </nav>
    <main>
      <slot />
    </main>
    <!-- footer rendered inside HomePage -->
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { RouterLink } from "vue-router";

const navItems = [
  { id: "quickstart", href: "#quickstart", label: "快速开始" },
  { id: "diagnostics", href: "#diagnostics", label: "运维诊断" },
  { id: "query", href: "#query", label: "数据查询" },
  { id: "taurusdb", href: "#taurusdb", label: "专属能力" },
  { id: "agents", href: "#agents", label: "Agent 配置" },
  { id: "github", href: "https://github.com/youweichen0208/taurus-mcp-server", label: "GitHub", external: true },
];

const activeSection = ref("");
let observer = null;

function scrollTo(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

onMounted(() => {
  const ids = navItems.filter((n) => !n.external).map((n) => n.id);
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          activeSection.value = entry.target.id;
        }
      });
    },
    { threshold: 0.25, rootMargin: "-80px 0px -40% 0px" }
  );
  ids.forEach((id) => {
    const el = document.getElementById(id);
    if (el) observer.observe(el);
  });

  // Reveal observer
  document.querySelectorAll(".reveal").forEach((el) => {
    const revealObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            revealObs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.08 }
    );
    revealObs.observe(el);
  });
});

onBeforeUnmount(() => {
  if (observer) observer.disconnect();
});
</script>
```

- [ ] **Step 1: Rewrite SiteShell**

Replace all content in `src/components/SiteShell.vue` with the code above.

- [ ] **Step 2: Commit**

```bash
git add src/components/SiteShell.vue
git commit -m "feat: update SiteShell with scroll-tracking nav and reveal observer"
```

---

## Task 10: Simplify router — single route + legacy redirects

**Files:** `src/router/index.js` (rewrite)

```js
// src/router/index.js

import { createRouter, createWebHistory } from "vue-router";
import HomePage from "../pages/HomePage.vue";

const legacyRedirects = {
  "/mcp": "#hero",
  "/mcp/diagnostics": "#diagnostics",
  "/mcp/query": "#query",
  "/mcp/taurusdb": "#taurusdb",
  "/agents": "#agents",
};

const routes = [
  { path: "/", component: HomePage },
  {
    path: "/:pathMatch(.*)*",
    beforeEnter(to) {
      const anchor = legacyRedirects[to.path];
      if (anchor) {
        return { path: "/", hash: anchor, replace: true };
      }
      return { path: "/", replace: true };
    },
    component: HomePage,
  },
];

export default createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition;
    if (to.hash) return { el: to.hash, behavior: "smooth", top: 72 };
    return { top: 0 };
  },
});
```

- [ ] **Step 1: Rewrite router**

Replace all content in `src/router/index.js` with the code above.

- [ ] **Step 2: Run dev server to verify routes work**

```bash
npm run dev
```

Open http://localhost:5173 and verify:
- Home page loads at `/`
- `/mcp/diagnostics` redirects to `/#diagnostics` and scrolls
- `/agents/cursor` falls back to `/`

- [ ] **Step 3: Commit**

```bash
git add src/router/index.js
git commit -m "feat: simplify router to single page with legacy redirect anchors"
```

---

## Task 11: Delete unused files

**Files to delete:**
- `src/pages/McpOverviewPage.vue`
- `src/pages/DiagnosticsPage.vue`
- `src/pages/QueryPage.vue`
- `src/pages/TaurusNativePage.vue`
- `src/pages/TaurusNativeScenarioPage.vue`
- `src/pages/AgentsPage.vue`
- `src/pages/AgentSetupPage.vue`
- `src/components/CategoryCard.vue`
- `src/components/ScenarioDemo.vue`
- `src/components/OutputCard.vue`

- [ ] **Step 1: Delete old page files**

```bash
git rm src/pages/McpOverviewPage.vue \
       src/pages/DiagnosticsPage.vue \
       src/pages/QueryPage.vue \
       src/pages/TaurusNativePage.vue \
       src/pages/TaurusNativeScenarioPage.vue \
       src/pages/AgentsPage.vue \
       src/pages/AgentSetupPage.vue \
       src/components/CategoryCard.vue \
       src/components/ScenarioDemo.vue \
       src/components/OutputCard.vue
```

- [ ] **Step 2: Run dev server to verify no broken imports**

```bash
npm run dev
```

Expected: no errors referencing deleted files.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "chore: remove unused pages and components from old multi-page layout"
```

---

## Task 12: Final integration test and polish

- [ ] **Step 1: Run dev server**

```bash
npm run dev
```

Open http://localhost:5173 and verify manually:
- [ ] Hero section: gradient orange text visible, terminal animation loops
- [ ] Navigation: clicking "运维诊断" scrolls smoothly to `#diagnostics`, nav link highlights
- [ ] Each DemoSection: left copy with green bullet points visible, terminal animation loops
- [ ] AgentTabs: clicking each tab swaps terminal content correctly
- [ ] Footer CTA and GitHub link work
- [ ] Mobile: resize browser to 400px, verify single-column layout, no overflow

- [ ] **Step 2: Check build succeeds**

```bash
npm run build
```

Expected: build completes without errors, `dist/` generated.

- [ ] **Step 3: Commit final state**

```bash
git add -A
git commit -m "chore: site redesign complete — Tavily-style dark-blue single-page scroll"
```
