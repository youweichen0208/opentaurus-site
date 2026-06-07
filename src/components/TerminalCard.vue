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
</script>
