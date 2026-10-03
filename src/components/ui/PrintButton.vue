<script setup lang="ts">
import { Printer } from '@lucide/vue'
import { ref } from 'vue'

const isPreparing = ref(false)

async function printResume(): Promise<void> {
  isPreparing.value = true

  try {
    await document.fonts.ready
    window.print()
  } finally {
    isPreparing.value = false
  }
}
</script>

<template>
  <button
    type="button"
    class="inline-flex min-h-11 items-center gap-2 rounded-md bg-[#183c36] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#102e29] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#183c36] active:translate-y-px disabled:cursor-wait disabled:opacity-70"
    :disabled="isPreparing"
    @click="printResume"
  >
    <Printer :size="17" :stroke-width="1.8" aria-hidden="true" />
    {{ isPreparing ? 'Preparing...' : 'Print / Save PDF' }}
  </button>
</template>
