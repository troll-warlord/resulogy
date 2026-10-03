<script setup lang="ts">
import ResumeHeader from '@/components/resume/ResumeHeader.vue'
import SectionRenderer from '@/components/sections/SectionRenderer.vue'
import { toResumeCssVariables } from '@/domain/cssVariables'
import type { NormalizedResume } from '@/domain/resume'

import './editorial.css'

defineProps<{
  resume: NormalizedResume
}>()
</script>

<template>
  <article
    class="resume-document theme-editorial"
    :data-page-size="resume.presentation.page.size"
    :data-page-margin="resume.presentation.page.margin"
    :style="toResumeCssVariables(resume.presentation)"
  >
    <ResumeHeader :basics="resume.basics" />

    <SectionRenderer v-for="section in resume.sections" :key="section.id" :section="section" />
  </article>
</template>
