<script setup lang="ts">
import BulletList from '@/components/resume/BulletList.vue'
import ResumeEntry from '@/components/resume/ResumeEntry.vue'
import ResumeSection from '@/components/resume/ResumeSection.vue'
import type { NormalizedSection } from '@/domain/resume'

defineProps<{ section: Extract<NormalizedSection, { type: 'custom' }> }>()
</script>

<template>
  <ResumeSection
    :id="section.id"
    :title="section.title"
    :break-policy="section.options.breakPolicy"
  >
    <p v-if="section.body" class="resume-copy">{{ section.body }}</p>

    <div
      v-if="section.items?.length"
      class="resume-entries"
      :data-layout="section.layout ?? 'stacked'"
    >
      <ResumeEntry
        v-for="(item, index) in section.items"
        :key="`${item.heading ?? 'item'}-${index}`"
        :heading="item.heading ?? item.subheading ?? `Item ${index + 1}`"
        :subheading="item.heading ? item.subheading : undefined"
        :meta="item.meta"
        :href="item.url"
      >
        <p v-if="item.text" class="resume-copy">{{ item.text }}</p>
        <BulletList :items="item.highlights" :marker="section.options.bulletMarker" />
      </ResumeEntry>
    </div>
  </ResumeSection>
</template>
