import { describe, expect, it } from 'vitest'

import { themeIdSchema } from '../../src/schema/presentation'
import { defaultThemeId, getThemeManifest, themeIds } from '../../src/themes/manifest'
import { getTheme } from '../../src/themes/registry'

describe('theme registration', () => {
  it('uses the catalog as the schema theme source', () => {
    expect(themeIdSchema.options).toEqual(themeIds)
    expect(themeIds).toContain(defaultThemeId)
  })

  it.each(themeIds)('resolves manifest and component for %s', (id) => {
    const manifest = getThemeManifest(id)
    const theme = getTheme(id)

    expect(manifest.id).toBe(id)
    expect(theme.id).toBe(id)
    expect(theme.component).toBeDefined()
  })
})
