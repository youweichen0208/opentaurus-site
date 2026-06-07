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
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from "vue";
import { RouterLink } from "vue-router";

const navItems = [
  { id: "quickstart", href: "#quickstart", label: "快速开始" },
  { id: "security", href: "#security", label: "安全架构" },
  { id: "instances", href: "#instances", label: "实例发现" },
  { id: "diagnostics", href: "#diagnostics", label: "运维诊断" },
  { id: "locks", href: "#locks", label: "锁竞争" },
  { id: "query", href: "#query", label: "数据查询" },
  { id: "flashback", href: "#flashback", label: "Flashback" },
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

let revealObserver = null;

onMounted(async () => {
  await nextTick();
  await nextTick();
  await new Promise((r) => setTimeout(r, 50));

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

  revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("is-visible");
          revealObserver.unobserve(e.target);
        }
      });
    },
    { threshold: 0.08 }
  );
  document.querySelectorAll(".reveal").forEach((el) => {
    revealObserver.observe(el);
  });
});

onBeforeUnmount(() => {
  if (observer) observer.disconnect();
  if (revealObserver) revealObserver.disconnect();
});
</script>
