<script setup lang="ts">
import { Globe2, Mail, MapPin, Phone } from '@lucide/vue'
import { computed, type Component } from 'vue'

import type { NormalizedResume } from '@/domain/resume'

import BrandIcon from './BrandIcon.vue'
import { getBrandIcon, type BrandIconDefinition } from './brandIcons'

const props = defineProps<{
  basics: NormalizedResume['basics']
}>()

interface GenericContactItem {
  kind: 'generic'
  label: string
  href?: string
  icon: Component
}

interface BrandContactItem {
  kind: 'brand'
  label: string
  href: string
  icon: BrandIconDefinition
}

type ContactItem = GenericContactItem | BrandContactItem

const location = computed(() =>
  [props.basics.location?.city, props.basics.location?.region, props.basics.location?.country]
    .filter(Boolean)
    .join(', '),
)

const contacts = computed<ContactItem[]>(() => {
  const items: ContactItem[] = []

  if (props.basics.email) {
    items.push({
      kind: 'generic',
      label: props.basics.email,
      href: `mailto:${props.basics.email}`,
      icon: Mail,
    })
  }
  if (props.basics.phone) {
    items.push({
      kind: 'generic',
      label: props.basics.phone,
      href: `tel:${props.basics.phone.replace(/[^+\d]/g, '')}`,
      icon: Phone,
    })
  }
  if (location.value) {
    items.push({ kind: 'generic', label: location.value, icon: MapPin })
  }
  if (props.basics.website) {
    items.push({
      kind: 'generic',
      label: props.basics.website.replace(/^https?:\/\//, '').replace(/\/$/, ''),
      href: props.basics.website,
      icon: Globe2,
    })
  }
  for (const social of props.basics.social ?? []) {
    const icon = getBrandIcon(social.network)
    const label = social.username ? `${social.network}: ${social.username}` : social.network

    if (icon) {
      items.push({ kind: 'brand', label, href: social.url, icon })
    } else {
      items.push({ kind: 'generic', label, href: social.url, icon: Globe2 })
    }
  }

  return items
})
</script>

<template>
  <header class="resume-header">
    <div class="resume-header__identity">
      <h1>{{ basics.name }}</h1>
      <p v-if="basics.label">{{ basics.label }}</p>
    </div>

    <address v-if="contacts.length" class="resume-contact-list">
      <component
        :is="item.href ? 'a' : 'span'"
        v-for="item in contacts"
        :key="`${item.label}-${item.href ?? 'plain'}`"
        class="resume-contact"
        :href="item.href"
        :target="item.href?.startsWith('http') ? '_blank' : undefined"
        :rel="item.href?.startsWith('http') ? 'noopener noreferrer' : undefined"
      >
        <BrandIcon v-if="item.kind === 'brand'" :icon="item.icon" />
        <component
          :is="item.icon"
          v-else
          :size="13"
          :stroke-width="1.8"
          aria-hidden="true"
          :data-generic-icon="item.icon === Globe2 ? 'globe' : undefined"
        />
        <span>{{ item.label }}</span>
      </component>
    </address>
  </header>
</template>
