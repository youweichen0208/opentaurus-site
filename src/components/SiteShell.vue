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
