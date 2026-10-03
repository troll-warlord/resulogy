<script setup lang="ts">
withDefaults(
  defineProps<{
    items?: string[]
    label?: string
  }>(),
  {
    label: 'Related details',
  },
)
</script>

<template>
  <ul v-if="items?.length" class="resume-keywords" :aria-label="label">
    <li v-for="item in items" :key="item">{{ item }}</li>
  </ul>
</template>
