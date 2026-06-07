<template>
  <section class="section" id="taurusdb">
    <div class="section-inner">
      <div class="section-head reveal">
        <div class="eyebrow">TAURUSD EXCLUSIVES</div>
        <h2>发挥 TaurusDB 独有价值</h2>
        <p class="text-2">
          TaurusDB 的原生能力通过 MCP 无缝对接 AI Agent，从数据掩码到在线 ddl 全链路覆盖。
        </p>
      </div>

      <div class="reveal">
        <div class="tab-bar">
          <button
            v-for="scenario in scenarios"
            :key="scenario.id"
            class="tab-btn"
            :class="{ 'is-active': activeId === scenario.id }"
            @click="activeId = scenario.id"
          >
            {{ scenario.label }}
          </button>
        </div>

        <div style="margin-bottom: 12px; padding: 8px 0;">
          <div class="term-dim" style="font-size: 0.72rem; letter-spacing: 0.06em; text-transform: uppercase;">
            {{ active.tagline }}
          </div>
        </div>

        <TerminalCard :title="`TaurusDB · ${active.label}`">
          <div class="anim-block">
            <div
              v-for="(step, i) in active.steps"
              :key="i"
              :class="['anim-msg', `anim-msg-${i + 1}`]"
            >
              <!-- chat row -->
              <div
                v-if="step.type === 'chat'"
                class="chat-row"
                :class="step.user ? 'chat-row-user' : 'chat-row-agent'"
              >
                <div class="chat-bubble">
                  {{ step.user || step.agent }}
                </div>
              </div>

              <!-- tool call -->
              <div v-if="step.type === 'tool'" class="tool-call">
                <span class="tool-call-name">{{ step.name }}</span><span class="tool-call-args">{{ step.args }}</span>
              </div>

              <!-- result box -->
              <div v-if="step.type === 'result'">
                <div
                  :class="['tool-result', step.success ? '' : 'result-neutral']"
                  style="padding: 10px 14px; white-space: pre-wrap;"
                >
                  <div style="color: inherit !important; font-family: Inter, sans-serif; font-size: 0.72rem; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; margin-bottom: 6px; opacity: 0.7;">
                    {{ step.label }}
                  </div><template v-for="(line, j) in step.lines" :key="j">{{ line }}{{ j < step.lines.length - 1 ? '\n' : '' }}</template>
                </div>
              </div>
            </div>
          </div>
        </TerminalCard>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from "vue";
import TerminalCard from "./TerminalCard.vue";
import { taurusScenarios } from "../data/taurusScenariosTabs";

const scenarios = taurusScenarios;
const activeId = ref(scenarios[0].id);
const active = computed(() => scenarios.find((s) => s.id === activeId.value));
</script>

<style scoped>
.result-neutral {
  background: var(--brand-bg);
  border-color: rgba(249, 115, 22, 0.18);
  color: var(--brand-2);
}

.result-neutral::before {
  content: "";
}
</style>
