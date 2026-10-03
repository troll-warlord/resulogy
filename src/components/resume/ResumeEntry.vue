<script setup lang="ts">
import { ExternalLink } from '@lucide/vue'

import DateRange from './DateRange.vue'

defineProps<{
  heading: string
  subheading?: string
  location?: string
  meta?: string
  href?: string
  start?: string
  end?: string
}>()
</script>

<template>
  <article class="resume-entry">
    <header class="resume-entry__header">
      <div>
        <h3>
          <a v-if="href" :href="href" target="_blank" rel="noopener noreferrer">
            {{ heading }}
            <ExternalLink :size="11" :stroke-width="1.8" aria-hidden="true" />
          </a>
          <span v-else>{{ heading }}</span>
        </h3>

        <p v-if="subheading || location || meta" class="resume-entry__details">
          <span v-if="subheading">{{ subheading }}</span>
          <span v-if="location">{{ location }}</span>
          <span v-if="meta">{{ meta }}</span>
        </p>
      </div>

      <DateRange :start="start" :end="end" />
    </header>

    <slot />
  </article>
</template>
