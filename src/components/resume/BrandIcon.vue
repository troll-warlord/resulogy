<script setup lang="ts">
import type { BrandIconDefinition } from './brandIcons'

withDefaults(
  defineProps<{
    icon: BrandIconDefinition
    size?: number
  }>(),
  {
    size: 13,
  },
)
</script>

<template>
  <svg
    :width="size"
    :height="size"
    :viewBox="icon.viewBox"
    fill="currentColor"
    aria-hidden="true"
    focusable="false"
    :data-brand-icon="icon.id"
  >
    <path v-for="path in icon.paths" :key="path" :d="path" />
  </svg>
</template>
