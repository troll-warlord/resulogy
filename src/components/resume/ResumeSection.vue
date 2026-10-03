<script setup lang="ts">
import type { BreakPolicy } from '@/domain/resume'

defineProps<{
  id: string
  title: string
  breakPolicy: BreakPolicy
}>()
</script>

<template>
  <section class="resume-section" :aria-labelledby="`${id}-heading`" :data-break="breakPolicy">
    <h2 :id="`${id}-heading`" class="resume-section__title">{{ title }}</h2>
    <slot />
  </section>
</template>
