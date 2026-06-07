<template>
  <section class="section" :id="anchor">
    <div class="section-inner">
      <div class="demo-grid reveal">
        <div class="demo-copy">
          <div v-if="tag" class="eyebrow">{{ tag }}</div>
          <h2 v-html="title"></h2>
          <p class="text-2">{{ description }}</p>
          <ul v-if="features?.length" class="demo-features">
            <li v-for="f in features" :key="f">{{ f }}</li>
          </ul>
        </div>
        <div>
          <slot name="terminal" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  anchor: { type: String, required: true },
  tag: { type: String, default: "" },
  title: { type: String, required: true },
  description: { type: String, default: "" },
  features: { type: Array, default: () => [] },
});
</script>
