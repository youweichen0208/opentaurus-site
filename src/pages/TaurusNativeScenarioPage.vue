<template>
  <div v-if="entry">
    <section class="hero">
      <div class="section-inner hero-copy-only">
        <div class="hero-copy hero-copy-left">
          <div class="eyebrow">
            <span class="brand-mark" aria-hidden="true"></span>
            <span>TaurusDB Native Scenario</span>
          </div>
          <h1>{{ entry.title }}</h1>
          <p>{{ entry.description }}</p>
          <div class="local-nav">
            <RouterLink v-for="link in entry.links" :key="link.to" :to="link.to">
              {{ link.label }}
            </RouterLink>
          </div>
        </div>
      </div>
    </section>

    <div class="divider"></div>

    <section class="band">
      <div class="section-inner">
        <div class="timeline-intro">
          <span class="mode-tag mono">{{ entry.tag }}</span>
          <h2>{{ entry.prep.overviewTitle }}</h2>
          <p>{{ entry.prep.flowIntro }}</p>
        </div>

        <div class="prep-steps">
          <section
            v-for="(step, stepIndex) in entry.prep.steps"
            :key="step.title"
            class="step-shell"
            :ref="(el) => setStepRef(el, stepIndex)"
          >
            <div class="step-head">
              <span class="mode-tag mono">Setup Step</span>
              <h3>{{ step.title }}</h3>
            </div>

            <div class="prep-step-stack">
              <article class="setup-terminal-card">
                <div class="terminal-head">
                  <div class="lights"><span class="r"></span><span class="y"></span><span class="g"></span></div>
                  <div class="terminal-title mono">{{ step.terminalTitle }}</div>
                </div>
                <div
                  class="terminal-body mono setup-terminal-body"
                  :class="{ 'is-live': activeSteps.has(stepIndex) }"
                >
                  <template v-for="(entry, index) in buildSetupTimeline(step)" :key="`${step.title}-${index}`">
                    <div
                      v-if="entry.type === 'command'"
                      class="setup-command-line setup-live-line"
                      :style="{ animationDelay: `${entry.delay}s` }"
                    >
                      {{ entry.text }}
                    </div>
                    <div
                      v-else-if="entry.type === 'result'"
                      class="setup-result-line setup-live-line"
                      :style="{ animationDelay: `${entry.delay}s` }"
                    >
                      {{ entry.text }}
                    </div>
                    <div
                      v-else
                      class="setup-table-wrap setup-live-block"
                      :style="{ animationDelay: `${entry.delay}s` }"
                    >
                      <table class="output-table setup-terminal-table">
                        <thead>
                          <tr>
                            <th v-for="header in entry.table.headers" :key="header">{{ header }}</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="(row, rowIndex) in entry.table.rows" :key="rowIndex">
                            <td v-for="(cell, cellIndex) in row" :key="cellIndex">{{ cell }}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </template>
                </div>
              </article>
            </div>
          </section>
        </div>

        <div v-if="entry.scenario" class="demo-grid">
          <div class="timeline-intro timeline-intro-chat">
            <span class="mode-tag mono">Step 03</span>
            <h2>{{ entry.prep.demoStepTitle }}</h2>
            <p>{{ entry.prep.demoStepDescription }}</p>
          </div>
          <ScenarioDemo :scenario="entry.scenario" hide-intro />
        </div>

        <section v-else class="summary-band">
          <article class="card">
            <span class="mode-tag mono">Behavior Result</span>
            <h3>当前验证结果</h3>
            <ul class="compact-list">
              <li v-for="line in entry.prep.resultSummary" :key="line">{{ line }}</li>
            </ul>
          </article>
        </section>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { RouterLink, useRoute } from "vue-router";
import ScenarioDemo from "../components/ScenarioDemo.vue";
import { getTaurusNativeScenario } from "../data/taurusNative";

const route = useRoute();

const entry = computed(() => getTaurusNativeScenario(route.params.slug));
const stepRefs = ref([]);
const activeSteps = ref(new Set());
let observer;

function setStepRef(el, index) {
  if (el) {
    stepRefs.value[index] = el;
  }
}

function markStepActive(index) {
  if (activeSteps.value.has(index)) return;
  activeSteps.value = new Set([...activeSteps.value, index]);
}

function observeSteps() {
  observer?.disconnect();
  observer = new IntersectionObserver(
    (entries) => {
      for (const observed of entries) {
        if (!observed.isIntersecting) continue;
        const index = Number(observed.target.dataset.stepIndex);
        markStepActive(index);
        observer.unobserve(observed.target);
      }
    },
    {
      root: null,
      rootMargin: "-35% 0px -35% 0px",
      threshold: 0,
    },
  );

  stepRefs.value.forEach((el, index) => {
    if (!el) return;
    el.dataset.stepIndex = String(index);
    observer.observe(el);
  });
}

onMounted(async () => {
  await nextTick();
  observeSteps();
});

onBeforeUnmount(() => {
  observer?.disconnect();
});

watch(
  () => route.params.slug,
  async () => {
    activeSteps.value = new Set();
    stepRefs.value = [];
    await nextTick();
    observeSteps();
  },
);

function buildSetupTimeline(step) {
  let delay = 0.15;
  const entries = [];

  for (const interaction of step.interactions) {
    for (const line of interaction.commandLines) {
      entries.push({ type: "command", text: line, delay });
      delay += 0.22;
    }

    for (const line of interaction.resultLines || []) {
      entries.push({ type: "result", text: line, delay });
      delay += 0.28;
    }

    if (interaction.table) {
      entries.push({ type: "table", table: interaction.table, delay });
      delay += 0.35;
    }

    delay += 0.12;
  }

  return entries;
}
</script>
