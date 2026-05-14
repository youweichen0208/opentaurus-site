<template>
  <RouterLink class="category-card" :to="to">
    <span class="mode-tag mono">{{ tag }}</span>
    <h3>{{ title }}</h3>
    <p>{{ description }}</p>
    <ul>
      <li v-for="item in items" :key="item">{{ item }}</li>
    </ul>
  </RouterLink>
</template>

<script setup>
import { RouterLink } from "vue-router";

defineProps({
  to: String,
  tag: String,
  title: String,
  description: String,
  items: Array,
});
</script>
