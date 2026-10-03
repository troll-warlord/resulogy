<script setup lang="ts">
import BulletList from '@/components/resume/BulletList.vue'
import ResumeEntry from '@/components/resume/ResumeEntry.vue'
import ResumeSection from '@/components/resume/ResumeSection.vue'
import type { NormalizedSection } from '@/domain/resume'

defineProps<{ section: Extract<NormalizedSection, { type: 'certifications' }> }>()
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
        :subheading="item.issuer"
        :meta="item.credentialId ? `Credential ${item.credentialId}` : undefined"
        :href="item.url"
        :start="item.date"
        :end="item.expires"
      >
        <BulletList :items="item.highlights" :marker="section.options.bulletMarker" />
      </ResumeEntry>
    </div>
  </ResumeSection>
</template>
