<script setup lang="ts">
import BulletList from '@/components/resume/BulletList.vue'
import ResumeEntry from '@/components/resume/ResumeEntry.vue'
import ResumeSection from '@/components/resume/ResumeSection.vue'
import type { NormalizedSection } from '@/domain/resume'

defineProps<{ section: Extract<NormalizedSection, { type: 'awards' }> }>()
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
        :key="`${item.title}-${item.date ?? 'undated'}`"
        :heading="item.title"
        :subheading="item.awarder"
        :href="item.url"
        :start="item.date"
      >
        <p v-if="item.summary" class="resume-copy">{{ item.summary }}</p>
        <BulletList :items="item.highlights" :marker="section.options.bulletMarker" />
      </ResumeEntry>
    </div>
  </ResumeSection>
</template>
