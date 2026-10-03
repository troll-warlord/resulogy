<script setup lang="ts">
import type { BulletMarker } from '@/domain/resume'

withDefaults(
  defineProps<{
    items?: string[]
    marker?: BulletMarker
  }>(),
  {
    marker: 'disc',
  },
)
</script>

<template>
  <ul v-if="items?.length" class="resume-list" :data-bullet-marker="marker">
    <li v-for="item in items" :key="item">{{ item }}</li>
  </ul>
</template>
