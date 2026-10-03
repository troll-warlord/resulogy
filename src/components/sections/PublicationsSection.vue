<script setup lang="ts">
import ResumeEntry from '@/components/resume/ResumeEntry.vue'
import ResumeSection from '@/components/resume/ResumeSection.vue'
import type { NormalizedSection } from '@/domain/resume'

defineProps<{ section: Extract<NormalizedSection, { type: 'publications' }> }>()
</script>

<template>
  <ResumeSection
    :id="section.id"
    :title="section.title"
    :break-policy="section.options.breakPolicy"
  >
    <div class="resume-entries" :data-layout="section.layout ?? 'compact'">
      <ResumeEntry
        v-for="item in section.items"
        :key="`${item.name}-${item.date ?? 'undated'}`"
        :heading="item.name"
        :subheading="item.publisher"
        :meta="item.authors?.join(', ')"
        :href="item.url"
        :start="item.date"
      >
        <p v-if="item.summary" class="resume-copy">{{ item.summary }}</p>
      </ResumeEntry>
    </div>
  </ResumeSection>
</template>
