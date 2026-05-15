<template>
  <div>
    <HeroSection
      eyebrow="TaurusDB Native"
      title="把每个专属能力拆成单独场景页"
      description="这页只做分流，不再把 Recycle Bin、Dynamic Masking、Nonblocking DDL 的前置条件混在一起。每个能力都有自己的 setup、SQL、表预览和对话演示。"
      terminal-title="taurusdb native index"
      :terminal-lines="[
        '1. recycle bin recovery',
        '2. dynamic masking comparison',
        '3. nonblocking ddl verification',
        'mode: one scenario per page'
      ]"
      :links="[
        { label: '返回总览', to: '/mcp' },
        { label: '运维诊断', to: '/mcp/diagnostics' },
        { label: '数据查询', to: '/mcp/query' }
      ]"
    />

    <div class="divider"></div>

    <section class="band">
      <div class="section-inner">
        <div class="section-head">
          <h2>逐个场景展开</h2>
          <p>用户先看到对象是怎么建出来的、数据长什么样、为什么会进入这个问题状态，然后才进入 Cursor + OpenTaurus MCP 的对话流。</p>
        </div>

        <div class="scenario-gallery">
          <RouterLink
            v-for="item in taurusNativeScenarioPages"
            :key="item.slug"
            class="shot-card"
            :to="`/mcp/taurusdb/${item.slug}`"
          >
            <figcaption>
              <span class="mode-tag mono">{{ item.tag }}</span>
              <strong>{{ item.navTitle }}</strong>
              <span>{{ item.description }}</span>
            </figcaption>
          </RouterLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { RouterLink } from "vue-router";
import HeroSection from "../components/HeroSection.vue";
import { taurusNativeScenarioPages } from "../data/taurusNative";
</script>
