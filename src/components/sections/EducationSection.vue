<script setup lang="ts">
import BulletList from '@/components/resume/BulletList.vue'
import ResumeEntry from '@/components/resume/ResumeEntry.vue'
import ResumeSection from '@/components/resume/ResumeSection.vue'
import TagList from '@/components/resume/TagList.vue'
import type { NormalizedSection } from '@/domain/resume'

defineProps<{ section: Extract<NormalizedSection, { type: 'education' }> }>()

function qualification(studyType?: string, area?: string): string {
  return [studyType, area].filter(Boolean).join(' in ') || 'Education'
}
</script>

<template>
  <ResumeSection
    :id="section.id"
    :title="section.title"
    :break-policy="section.options.breakPolicy"
  >
    <div class="resume-entries" :data-layout="section.layout ?? 'stacked'">
      <ResumeEntry
        v-for="item in section.items"
        :key="`${item.institution}-${item.start}`"
        :heading="qualification(item.studyType, item.area)"
        :subheading="item.institution"
        :location="item.location"
        :meta="item.score"
        :href="item.url"
        :start="item.start"
        :end="item.end"
      >
        <BulletList :items="item.highlights" :marker="section.options.bulletMarker" />
        <TagList :items="item.honors" label="Honors" />
        <TagList :items="item.courses" label="Selected coursework" />
      </ResumeEntry>
    </div>
  </ResumeSection>
</template>
