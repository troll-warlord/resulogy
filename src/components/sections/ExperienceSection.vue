<script setup lang="ts">
import BulletList from '@/components/resume/BulletList.vue'
import ResumeEntry from '@/components/resume/ResumeEntry.vue'
import ResumeSection from '@/components/resume/ResumeSection.vue'
import TagList from '@/components/resume/TagList.vue'
import type { NormalizedSection } from '@/domain/resume'

defineProps<{
  section: Extract<NormalizedSection, { type: 'experience' }>
}>()
</script>

<template>
  <ResumeSection
    :id="section.id"
    :title="section.title"
    :break-policy="section.options.breakPolicy"
  >
    <div class="resume-entries">
      <ResumeEntry
        v-for="item in section.items"
        :key="`${item.company}-${item.position}-${item.start}`"
        :heading="item.company"
        :subheading="item.position"
        :location="item.location"
        :href="item.url"
        :start="item.start"
        :end="item.end"
      >
        <p v-if="item.summary" class="resume-copy">{{ item.summary }}</p>
        <BulletList :items="item.highlights" :marker="section.options.bulletMarker" />
        <TagList :items="item.keywords" label="Technologies" />
      </ResumeEntry>
    </div>
  </ResumeSection>
</template>
