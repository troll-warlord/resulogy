<script setup lang="ts">
import BulletList from '@/components/resume/BulletList.vue'
import ResumeEntry from '@/components/resume/ResumeEntry.vue'
import ResumeSection from '@/components/resume/ResumeSection.vue'
import type { NormalizedSection } from '@/domain/resume'

defineProps<{ section: Extract<NormalizedSection, { type: 'volunteering' }> }>()
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
        :key="`${item.organization}-${item.start}`"
        :heading="item.position ?? item.organization"
        :subheading="item.position ? item.organization : undefined"
        :location="item.location"
        :href="item.url"
        :start="item.start"
        :end="item.end"
      >
        <p v-if="item.summary" class="resume-copy">{{ item.summary }}</p>
        <BulletList :items="item.highlights" :marker="section.options.bulletMarker" />
      </ResumeEntry>
    </div>
  </ResumeSection>
</template>
