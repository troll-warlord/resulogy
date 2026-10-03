<script setup lang="ts">
import BulletList from '@/components/resume/BulletList.vue'
import ResumeSection from '@/components/resume/ResumeSection.vue'
import type { NormalizedSection } from '@/domain/resume'

defineProps<{
  section: Extract<NormalizedSection, { type: 'summary' }>
}>()
</script>

<template>
  <ResumeSection
    :id="section.id"
    :title="section.title"
    :break-policy="section.options.breakPolicy"
  >
    <p v-if="section.text" class="resume-copy">{{ section.text }}</p>
    <BulletList :items="section.highlights" :marker="section.options.bulletMarker" />
  </ResumeSection>
</template>
