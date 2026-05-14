<template>
  <SiteShell>
    <RouterView />
  </SiteShell>
</template>

<script setup>
import { RouterView } from "vue-router";
import SiteShell from "./components/SiteShell.vue";
</script>
