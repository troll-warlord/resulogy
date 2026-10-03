<script setup lang="ts">
import ThemeHost from '@/components/ThemeHost.vue'
import PrintButton from '@/components/ui/PrintButton.vue'
import ValidationErrorPanel from '@/components/ui/ValidationErrorPanel.vue'
import { loadResume } from '@/content/loadResume'
import { getThemeManifest } from '@/themes/manifest'

const result = loadResume(window.__RESULOGY_RESUME_YAML__)

if (result.success) {
  document.title = `${result.data.basics.name} - Resume`
}
</script>

<template>
  <div v-if="result.success" class="app-shell">
    <header class="app-toolbar screen-only">
      <div class="app-toolbar__identity">
        <a href="/" class="app-wordmark" aria-label="Resulogy home">Resulogy</a>
        <span aria-hidden="true"></span>
        <p>Resume preview</p>
      </div>

      <div class="app-toolbar__actions">
        <p class="app-document-meta">
          {{ result.data.presentation.page.size.toUpperCase() }}
          <span aria-hidden="true">|</span>
          {{ getThemeManifest(result.data.presentation.theme).label }}
        </p>
        <PrintButton />
      </div>
    </header>

    <main class="preview-stage">
      <ThemeHost :resume="result.data" />
    </main>
  </div>

  <ValidationErrorPanel v-else :issues="result.issues" />
</template>
