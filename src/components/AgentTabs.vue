<template>
  <section class="section" id="agents">
    <div class="section-inner">
      <div class="section-head reveal">
        <div class="eyebrow">AGENT SETUP</div>
        <h2>选择你的 Agent</h2>
        <p class="text-2">三种主流 AI 工具,同一套 MCP Server,一键接入</p>
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
