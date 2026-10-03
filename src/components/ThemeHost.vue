<script setup lang="ts">
import { computed } from 'vue'

import type { NormalizedResume } from '@/domain/resume'
import { getTheme } from '@/themes/registry'

const props = defineProps<{
  resume: NormalizedResume
}>()

const theme = computed(() => getTheme(props.resume.presentation.theme))
</script>

<template>
  <component :is="theme.component" :resume="resume" />
</template>
