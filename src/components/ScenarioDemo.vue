<template>
  <section class="feature feature-stack">
    <div class="demo-panel-intro">
      <span class="label mono">{{ scenario.label }}</span>
      <h3>{{ scenario.title }}</h3>
      <p>{{ scenario.description }}</p>
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
                <div class="answer-card demo-step step-5">
                  <div class="answer-title">最终回复</div>
                  <ul class="answer-list">
                    <li v-for="item in scenario.finalAnswer" :key="item">{{ item }}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div class="agent-side">
            <OutputCard
              v-for="(card, index) in scenario.outputCards"
              :key="card.title"
              :card="card"
              :step="index + 3"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import OutputCard from "./OutputCard.vue";

defineProps({
  scenario: Object,
});
</script>
