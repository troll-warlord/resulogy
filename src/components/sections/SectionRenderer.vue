<script setup lang="ts">
import { computed, type Component } from 'vue'

import type { NormalizedSection } from '@/domain/resume'

import { sectionComponents } from './sectionComponents'

const props = defineProps<{
  section: NormalizedSection
}>()

const component = computed<Component>(() => sectionComponents[props.section.type])
</script>

<template>
  <component :is="component" :section="section" />
</template>
