<script setup lang="ts">
import ResumeSection from '@/components/resume/ResumeSection.vue'
import type { NormalizedSection } from '@/domain/resume'

const props = defineProps<{ section: Extract<NormalizedSection, { type: 'skills' }> }>()

const columnStyle = { '--section-columns': String(props.section.columns ?? 2) }
</script>

<template>
  <ResumeSection
    :id="section.id"
    :title="section.title"
    :break-policy="section.options.breakPolicy"
  >
    <dl class="resume-groups" :data-layout="section.layout ?? 'grid'" :style="columnStyle">
      <div v-for="group in section.items" :key="group.name" class="resume-group">
        <dt>{{ group.name }}</dt>
        <dd>
          {{ group.items.join(', ')
          }}<span v-if="group.level" class="resume-muted"> | {{ group.level }}</span>
        </dd>
      </div>
    </dl>
  </ResumeSection>
</template>
