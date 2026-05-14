<template>
  <section class="hero">
    <div class="section-inner hero-wrap">
      <div class="hero-copy hero-copy-left">
        <div class="eyebrow">
          <span class="brand-mark" aria-hidden="true"></span>
          <span>{{ eyebrow }}</span>
        </div>
        <h1>{{ title }}</h1>
        <p>{{ description }}</p>
        <div v-if="links?.length" class="local-nav">
          <component
            :is="link.external ? 'a' : RouterLink"
            v-for="link in links"
            :key="link.to"
            v-bind="link.external ? { href: link.to, target: '_blank', rel: 'noopener noreferrer' } : { to: link.to }"
          >
            {{ link.label }}
          </component>
        </div>
      </div>

      <div class="terminal">
        <div class="terminal-head">
          <div class="lights"><span class="r"></span><span class="y"></span><span class="g"></span></div>
          <div class="terminal-title mono">{{ terminalTitle }}</div>
        </div>
        <div class="terminal-body mono">
          <div v-for="line in terminalLines" :key="line">{{ line }}</div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { RouterLink } from "vue-router";

defineProps({
  eyebrow: String,
  title: String,
  description: String,
  terminalTitle: String,
  terminalLines: Array,
  links: Array,
});
</script>
