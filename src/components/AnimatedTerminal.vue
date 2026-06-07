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
