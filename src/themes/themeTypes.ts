import type { Component } from 'vue'

import type { ResolvedThemeSettings } from '@/domain/presentation'

export interface ThemeManifest<Id extends string = string> {
  id: Id
  label: string
  description: string
  defaults: ResolvedThemeSettings
}

export interface ThemeDefinition<Id extends string = string> extends ThemeManifest<Id> {
  component: Component
}
