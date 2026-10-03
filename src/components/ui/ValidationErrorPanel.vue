<script setup lang="ts">
import { AlertTriangle } from '@lucide/vue'

import type { ResumeIssue } from '@/content/result'

defineProps<{
  issues: ResumeIssue[]
}>()

function issueLocation(issue: ResumeIssue): string {
  if (issue.line && issue.column) return `Line ${issue.line}, column ${issue.column}`
  return issue.path.length > 0 ? issue.path.join('.') : 'resume.yaml'
}
</script>

<template>
  <main class="mx-auto flex min-h-dvh max-w-3xl items-center px-6 py-16">
    <section
      class="w-full border border-red-200 bg-white p-6 shadow-sm"
      aria-labelledby="resume-error-title"
    >
      <div class="flex items-start gap-3">
        <AlertTriangle class="mt-0.5 shrink-0 text-red-700" :size="22" aria-hidden="true" />
        <div>
          <h1 id="resume-error-title" class="text-xl font-semibold text-zinc-950">
            Resume configuration could not be loaded
          </h1>
          <p class="mt-1 text-sm leading-6 text-zinc-600">
            Correct the following issues in <code>resume.yaml</code> and reload the page.
          </p>
        </div>
      </div>

      <ol class="mt-6 divide-y divide-zinc-200 border-y border-zinc-200">
        <li v-for="issue in issues" :key="`${issue.code}-${issueLocation(issue)}`" class="py-4">
          <p class="font-mono text-xs font-semibold text-red-800">{{ issueLocation(issue) }}</p>
          <p class="mt-1 text-sm text-zinc-800">{{ issue.message }}</p>
        </li>
      </ol>
    </section>
  </main>
</template>
