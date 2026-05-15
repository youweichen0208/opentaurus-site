<template>
  <article class="output-card demo-step" :class="stepClass">
    <h4>{{ card.title }}</h4>

    <div v-if="card.meta?.length" class="output-meta">
      <span v-for="item in card.meta" :key="item.label">
        <strong>{{ item.label }}</strong><br />
        {{ item.value }}
      </span>
    </div>

    <ul v-if="card.lines?.length" class="output-lines">
      <li v-for="line in card.lines" :key="line">{{ line }}</li>
    </ul>

    <table v-if="card.table" class="output-table">
      <thead>
        <tr>
          <th v-for="header in card.table.headers" :key="header">{{ header }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, rowIndex) in card.table.rows" :key="rowIndex">
          <td v-for="(cell, cellIndex) in row" :key="cellIndex">{{ cell }}</td>
        </tr>
      </tbody>
    </table>
  </article>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  card: Object,
  step: {
    type: Number,
    default: 3,
  },
});

const stepClass = computed(() => `step-${props.step}`);
</script>
