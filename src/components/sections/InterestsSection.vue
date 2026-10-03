<script setup lang="ts">
import ResumeSection from '@/components/resume/ResumeSection.vue'
import type { NormalizedSection } from '@/domain/resume'

const props = defineProps<{ section: Extract<NormalizedSection, { type: 'interests' }> }>()

const columnStyle = { '--section-columns': String(props.section.columns ?? 2) }
</script>

<template>
  <ResumeSection
    :id="section.id"
    :title="section.title"
    :break-policy="section.options.breakPolicy"
  >
    <dl class="resume-groups" :data-layout="section.layout ?? 'inline'" :style="columnStyle">
      <div
        v-for="item in section.items"
        :key="item.name"
        class="resume-group resume-group--compact"
      >
        <dt>{{ item.name }}</dt>
        <dd v-if="item.keywords?.length">{{ item.keywords.join(', ') }}</dd>
      </div>
    </dl>
  </ResumeSection>
</template>
