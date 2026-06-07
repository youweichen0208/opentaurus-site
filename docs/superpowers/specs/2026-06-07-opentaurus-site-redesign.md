# OpenTaurus Site Redesign — Tavily-style Scroll Narrative

**Date:** 2026-06-07
**Status:** Draft
**Scope:** Full visual redesign + single-page scroll narrative with animated demos

---

## Goal

Redesign the OpenTaurus site as a single-page scrolling narrative with embedded animated demo terminals, following the visual language of Tavily's marketing site (deep dark background, bold Inter typography, large hero, scroll-driven storytelling). All existing content is preserved — diagnostics, query, taurusdb native, and agent configuration — restructured into a cohesive one-page flow.

---

## Design System

### Colors

| Token | Value | Usage |
|---|---|---|
| `--bg` | `linear-gradient(180deg, #0f1a2e 0%, #0b1624 100%)` | Page background gradient |
| `--bg-solid` | `#0d1829` | Solid fallback for bg |
| `--surface` | `rgba(255, 255, 255, 0.04)` | Card backgrounds |
| `--surface-raised` | `rgba(255, 255, 255, 0.07)` | Elevated surfaces |
| `--surface-solid` | `#111d35` | Solid card background fallback |
| `--border` | `rgba(255, 255, 255, 0.08)` | Borders and dividers |
| `--text` | `#fafafa` | Primary text |
| `--text-secondary` | `rgba(255, 255, 255, 0.55)` | Secondary / muted text |
| `--text-tertiary` | `rgba(255, 255, 255, 0.35)` | Subtle labels |
| `--brand` | `#f97316` | Brand orange, primary CTA |
| `--brand-glow` | `rgba(249, 115, 22, 0.25)` | Orange glow shadow |
| `--accent-blue` | `#3b82f6` | Info, tool call highlights |
| `--success` | `#22c55e` | Success states, terminal prompt |
| `--warning` | `#fbbf24` | Warnings |
| `--hero-glow` | `rgba(59, 130, 246, 0.1)` | Blue radial glow (top of page) |
| `--brand-glow-bg` | `rgba(249, 115, 22, 0.14)` | Orange radial glow (brand sections) |
| `--terminal` | `#0c0c10` | Terminal card solid background |
| `--terminal-text` | `rgba(255, 255, 255, 0.8)` | Terminal body text |

### Typography

| Element | Font | Weight | Size | Tracking | Line-height |
|---|---|---|---|---|---|
| Hero title | Inter | 800 | `clamp(3rem, 7vw, 5rem)` | -0.045em | 1.05 |
| Section title | Inter | 700 | `clamp(1.8rem, 4vw, 2.8rem)` | -0.035em | 1.1 |
| Subsection title | Inter | 700 | 1.25rem | -0.02em | 1.2 |
| Body | Inter | 400 | 1rem (0.95rem secondary) | normal | 1.65 |
| Code / terminal | JetBrains Mono | 400 | 0.82rem | normal | 1.7 |
| Eyebrow label | Inter | 600 | 0.75rem | 0.06em uppercase | 1 |
| Chinese fallback | PingFang SC, Noto Sans SC | — | — | — | — |

### Spacing

| Token | Value |
|---|---|
| Section padding (vertical) | clamp(72px, 12vw, 120px) top, clamp(48px, 8vw, 80px) bottom |
| Max content width | 1140px |
| Side padding | clamp(16px, 4vw, 32px) |
| Card radius | 16px |
| Terminal radius | 16px |
| Button radius | 12px |

### Shadows

| Token | Value |
|---|---|
| Card shadow | `0 8px 32px rgba(0, 0, 0, 0.3)` |
| Terminal shadow | `0 24px 80px rgba(0, 0, 0, 0.4)` |
| Button glow | `0 0 0 1px rgba(249, 115, 22, 0.2), 0 0 24px rgba(249, 115, 22, 0.18)` |
| Nav backdrop | `backdrop-filter: blur(16px)` |

---

## Page Structure

Single-page SPA. Router is simplified — the home page (`/`) is now the full scroll narrative. Legacy routes (`/mcp/diagnostics`, `/mcp/query`, etc.) redirect to the corresponding anchor on the home page.

### Anchors

| # | Section ID | Nav Label | Description |
|---|---|---|---|
| 1 | `#hero` | — | Brand statement + CTA + install terminal |
| 2 | `#quickstart` | 快速开始 | 3-step cards: install, configure, connect |
| 3 | `#diagnostics` | 运维诊断 | Left copy + right terminal demo |
| 4 | `#query` | 数据查询 | Left copy + right terminal demo |
| 5 | `#taurusdb` | 专属能力 | TaurusDB-specific features demo |
| 6 | `#agents` | Agent 配置 | Tab switcher for Claude / Codex / Cursor |
| 7 | `#footer` | — | Final CTA + GitHub link |

### Navigation Bar

Sticky top bar with backdrop-blur. Left: brand mark + "OpenTaurus" with `router-link` to `/`. Right: nav links to each anchor (`href="#diagnostics"` etc.) + external GitHub link. Active section is highlighted via IntersectionObserver tracking — the current section's nav link gets `color: var(--brand)`.

---

## Section Specifications

### 1. Hero Section

**Layout:** Full viewport height, centered content.

**Background:** Page gradient + a large blue radial glow (`var(--hero-glow)`) centered at top, 50vw radius.

**Content stack (centered, max-width 720px):**
1. Eyebrow pill: `NEW · TaurusDB MCP Server v1.0` — border `--brand`, background `rgba(249,115,22,0.1)`, text color `var(--brand)`.
2. Title: `让 AI Agent 直接操控 TaurusDB` — "TaurusDB" in a CSS gradient (`linear-gradient(135deg, #f97316, #fdba74)` with `background-clip: text`).
3. Description paragraph: secondary text color.
4. Button row: Primary button "快速开始 →" (orange bg, glow shadow) + Secondary button "GitHub" (transparent bg, border).
5. Terminal card below (max-width 520px, centered).

**Terminal card:** Dark surface (`--bg-solid` or `#0c0c0e`), border `--border`, shadow `--terminal-shadow`.
- Head: 3 traffic light dots (red/yellow/green `#ff5f57 #febc2e #28c840`).
- Body: 4 lines animated sequentially — `$ npx @opentaurus/taurusdb-mcp`, loading spinner line, success line (`✔` in green), summary line in muted text.
- Animation: CSS `@keyframes` with staggered `animation-delay`, 6s loop, infinite.

### 2. Quick Start Section

**Layout:** Section header (centered) + 3-column card grid.

**Section header:** Eyebrow `QUICK START`, title `三步接入 TaurusDB`, one-line description.

**Cards (3):**

| Card | Tag | Title | Body |
|---|---|---|---|
| 1 | `Step 1` | 安装 MCP Server | Code snippet: `npm install @opentaurus/taurusdb-mcp` |
| 2 | `Step 2` | 配置 Agent | Code snippet showing agent config |
| 3 | `Step 3` | 连接 TaurusDB | Code snippet showing successful connection |

**Card style:** `--surface` background, `--border`, 16px radius, `--card-shadow`. Each card: tag pill (top-left), icon/number circle (28px, orange border), title (bold), description, terminal-style code block at bottom.

### 3. Diagnostics Demo Section

**Layout:** Two-column grid — left copy (1fr) + right terminal (1.2fr), vertically centered.

**Left copy:**
- Eyebrow: `运维诊断` (orange pill)
- Title: `一句话诊断数据库异常` (section title style)
- Description paragraph
- Bullet list (4 items): 慢查询分析, 锁等待检测, 资源趋势, 参数巡检. Each with a green dot (6px circle, `--success`) before text.

**Right terminal:** Animated chat mock.
- Header: Agent name (e.g., "Claude Code") + MCP tag.
- Body: sequential messages:
  1. User input: `帮我分析最近的慢查询` (prompt `❯` in secondary)
  2. Agent reply bubble: acknowledgment text
  3. Tool call: `query_slow_queries(...)` — name in `--accent-blue`, left border orange
  4. Tool result: success card with green border
  5. Final agent answer with actionable insights
- Animation: CSS keyframes, 8s loop, staggered delays per message.

### 4. Query Demo Section

Same layout pattern as Diagnostics, but content:
- Title: `自然语言查询数据库`
- Features: 自然语言转SQL, 多表关联查询, 结果可视化, 查询优化建议

Terminal mock shows: user asking "查一下最近7天订单最多的前10个城市" → agent calls `execute_query` with generated SQL → result table with city/order data → summary answer.

### 5. TaurusDB Native Demo Section

Same layout, content:
- Title: `发挥 TaurusDB 专属优势`
- Features: 存储计算分离感知, 只读副本路由, 全局一致性检查, 弹性伸缩监控

Terminal mock shows a TaurusDB-specific scenario (e.g., switching read replicas).

### 6. Agent Configuration Section

**Layout:** Section header + tab switcher + terminal panel.

**Tab bar:** Pill-style tabs for Claude Code / Codex / Cursor. Active tab: `--brand` background with 12% opacity, text color `--brand`, border `rgba(249,115,22,0.2)`. Inactive tabs: `--surface` bg, `--text-secondary`. Clicking a tab swaps the terminal content (Vue `v-if` or `v-show`, driven by reactive `activeAgent` ref).

**Terminal content per agent:**
- Step 1 label + install command (copyable)
- Step 2 label + agent-specific config code block
- Step 3 label + verification output (green `✔ connected`)

Data source: existing `src/data/agentSetup.js` restructured for the new format.

### 7. Footer

**Layout:** Darker gradient band. Centered CTA text `开始使用 OpenTaurus` + primary button + GitHub secondary button. Below: horizontal rule + minimal footer bar (left: "OpenTaurus · 由社区驱动", right: GitHub link + license note).

---

## Animation Strategy

### Scroll-triggered entry

Use native `IntersectionObserver` (no library). Each section and each card/terminal gets a `data-reveal` attribute. Observer adds `.is-visible` class which triggers a CSS transition: `opacity 0` → `1`, `translateY(20px)` → `0`, duration 600ms `ease-out`. Stagger children by 100ms using `transition-delay` on nth-child.

### Terminal animations

Reuse the existing `@keyframes toolLine` pattern with tighter timing:
- Total loop: 8 seconds (was 10s)
- Stagger between lines: 0.4s (was ~0.65s)
- Ease: `ease-out` for smoother feel

Each animated block gets an `animation-delay` class. Loop is `infinite`.

### Nav scroll tracking

A single `IntersectionObserver` on each section (`{ threshold: 0.3 }`) updates a `currentSection` ref in `SiteShell.vue`. Nav links with matching anchor ID get the active highlight style.

---

## Data Layer

No new data files needed. Existing data files are retained and restructured:

| File | Used by | Restructure notes |
|---|---|---|
| `src/data/mcp.js` | Diagnostics + Query + TaurusDB demos | Split into per-scenario exports; each exports a `steps` array for animation |
| `src/data/agentSetup.js` | Agent config section | Add `tabId`, `steps` array with `label` + `command` + `result` fields |
| `src/data/taurusNative.js` | TaurusDB native demo | Keep as-is, adapt step animation |

---

## File Structure

```
src/
  styles/
    site.css           ← fully rewritten (new design tokens + component styles)
  components/
    SiteShell.vue      ← updated (scroll-tracking nav, anchor links)
    HeroSection.vue    ← new (or heavily refactored)
    QuickStartCard.vue ← new (replaces CategoryCard for section 2)
    DemoSection.vue    ← new (generic left-copy / right-terminal layout)
    AgentConfigTabs.vue← new (tab switcher + terminal per agent)
    TerminalCard.vue   ← new (reusable terminal wrapper: head + body slot)
    AnimatedTerminal.vue ← new (wraps TerminalCard with animation timing logic)
  pages/
    HomePage.vue       ← main scroll page, assembles all sections
    LegacyRedirect.vue ← simple component for old routes → redirects to HomePage anchor
  router/
    index.js           ← simplified: / → HomePage, /mcp/* → redirect to /#anchor
  data/
    mcp.js             ← restructured
    agentSetup.js      ← restructured
    taurusNative.js    ← kept
```

### Removed / deprecated

- `CategoryCard.vue` — replaced by section-specific components
- `ScenarioDemo.vue` — replaced by `DemoSection.vue` + `AnimatedTerminal.vue`
- `OutputCard.vue` — absorbed into `DemoSection.vue`
- Standalone pages (`McpOverviewPage.vue`, `DiagnosticsPage.vue`, `QueryPage.vue`, `TaurusNativePage.vue`, `TaurusNativeScenarioPage.vue`, `AgentSetupPage.vue`, `AgentsPage.vue`) — replaced by single-page scroll; router redirects handle old URLs for bookmark compatibility.

---

## Responsive Design

| Breakpoint | Change |
|---|---|
| ≤ 920px | All 2-column grid layouts become single column (copy above terminal). Category/triptych grids remain 2-col. |
| ≤ 720px | Nav collapses to hamburger or overflow menu. Hero padding reduced. Terminal font size drops to 0.78rem. |
| ≤ 520px | All multi-column grids → 1 column. Quick start cards stack vertically. Tab bar wraps. |

Use CSS Grid with `repeat(auto-fit, minmax(280px, 1fr))` for card grids to avoid hard breakpoints.

---

## Out of Scope

- Backend / real API integration for demos (pure frontend animation)
- Internationalization (content stays in Chinese)
- Dark/light mode toggle (dark only)
- Markdown rendering or blog features
- Analytics or tracking scripts
