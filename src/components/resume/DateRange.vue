<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  start?: string
  end?: string
}>()

function formatYearMonth(value?: string): string {
  if (!value) return ''
  if (value === 'present') return 'Present'

  const [year, month] = value.split('-').map(Number)
  if (!year || !month) return value

  return new Intl.DateTimeFormat('en', {
    month: 'short',
    timeZone: 'UTC',
    year: 'numeric',
  }).format(new Date(Date.UTC(year, month - 1)))
}

const label = computed(() => {
  const start = formatYearMonth(props.start)
  const end = formatYearMonth(props.end)

  if (start && end) return `${start} - ${end}`
  return start || end
})
</script>

<template>
  <time v-if="label" class="resume-date">{{ label }}</time>
</template>
