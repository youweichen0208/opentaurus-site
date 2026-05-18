<template>
  <section class="feature feature-stack">
    <div v-if="!hideIntro" class="demo-panel-intro">
      <span class="label mono">{{ scenario.label }}</span>
      <h3>{{ scenario.title }}</h3>
      <p>{{ scenario.description }}</p>
    </div>

    <div v-if="showScenarioContext" class="scenario-context-grid">
      <article v-for="item in scenarioContext" :key="item.label" class="scenario-context-card">
        <span class="mono">{{ item.label }}</span>
        <p>{{ item.text }}</p>
      </article>
    </div>

    <div class="agent-panel agent-panel-chat">
      <div class="agent-head">
        <strong>{{ scenario.agentTitle }}</strong>
        <span class="mono">{{ scenario.agentMode }}</span>
      </div>
      <div class="agent-body">
        <div class="agent-layout">
          <div class="agent-chat-shell">
            <div class="chat-scroll">
              <div class="chat-row user demo-step step-1">
                <div class="chat-bubble">{{ scenario.userPrompt }}</div>
              </div>
              <div class="chat-row agent demo-step step-2">
                <div class="chat-bubble">{{ scenario.agentReply }}</div>
              </div>
              <div class="tool-strip demo-step step-3">
                <div class="tool-strip-title mono">Triggered Tools</div>
                <div class="tool-strip-list">
                  <span v-for="tool in scenario.tools" :key="tool" class="tool-pill">{{ tool }}</span>
                </div>
              </div>
              <div class="assistant-block stream-panel demo-step step-4">
                <div class="assistant-title">流式处理</div>
                <div class="stream-block">
                  <div v-for="line in scenario.streamLines" :key="line" class="stream-line thought-line">
                    {{ line }}
                  </div>
                </div>
                <div class="response-stack demo-step step-5">
                  <div
                    v-for="response in scenario.agentResponses"
                    :key="response.title"
                    class="answer-card"
                  >
                    <div class="answer-title">{{ response.title }}</div>
                    <ul class="answer-list">
                      <li v-for="item in response.lines" :key="item">{{ item }}</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div class="agent-side">
                <OutputCard
                  v-for="(card, index) in scenario.outputCards"
                  :key="card.title"
                  :card="card"
                  :step="index + 6"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from "vue";
import OutputCard from "./OutputCard.vue";

const props = defineProps({
  scenario: Object,
  hideIntro: {
    type: Boolean,
    default: false,
  },
  showScenarioContext: {
    type: Boolean,
    default: true,
  },
});

const scenarioContext = computed(() => {
  const scenario = props.scenario || {};
  const tools = scenario.tools || [];
  const firstTool = tools[0] || "MCP tool";
  const secondTool = tools[1] || "结构化诊断工具";
  const lastResponse = scenario.agentResponses?.at(-1)?.lines?.at(-1);

  return [
    {
      label: "客户现场",
      text: scenario.customerScene || scenario.description,
    },
    {
      label: "触发问题",
      text: scenario.userPrompt,
    },
    {
      label: "MCP 要证明",
      text:
        scenario.proofGoal ||
        `不是只调用 ${firstTool}，而是把 ${firstTool} 与 ${secondTool} 串成可复核的判断链。`,
    },
    {
      label: "客户能得到",
      text:
        scenario.customerTakeaway ||
        lastResponse ||
        "用户可以基于这条链路判断下一步是优化 SQL、处理会话、调整权限，还是确认专属能力已经生效。",
    },
  ];
});
</script>
