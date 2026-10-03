import type { Component } from 'vue'

import { getThemeManifest, themeIds, type ThemeId } from './manifest'
import type { ThemeDefinition } from './themeTypes'

const componentModules = import.meta.glob<{ default: Component }>('./*/*Resume.vue', {
  eager: true,
})

const themeComponents = new Map<ThemeId, Component>()

for (const [path, module] of Object.entries(componentModules)) {
  const folder = path.match(/^\.\/([^/]+)\/[^/]+Resume\.vue$/)?.[1]
  if (!folder || !themeIds.includes(folder as ThemeId)) continue

  const id = folder as ThemeId
  if (themeComponents.has(id)) {
    throw new Error(`Theme "${id}" has more than one root component ending in Resume.vue.`)
  }
  themeComponents.set(id, module.default)
}

export function getTheme(id: ThemeId): ThemeDefinition<ThemeId> {
  const component = themeComponents.get(id)
  if (!component) {
    throw new Error(`Theme "${id}" is registered without a matching *Resume.vue component.`)
  }

  return {
    ...getThemeManifest(id),
    component,
  }
}
