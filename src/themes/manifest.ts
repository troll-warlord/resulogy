import { editorialThemeManifest } from './editorial/metadata'
import { ledgerThemeManifest } from './ledger/metadata'
import type { ThemeManifest } from './themeTypes'

function defineThemeCatalog<const Catalog extends Record<string, ThemeManifest>>(
  catalog: Catalog & { [Id in keyof Catalog]: ThemeManifest<Id & string> },
): Catalog {
  return catalog
}

export const themeManifests = defineThemeCatalog({
  editorial: editorialThemeManifest,
  ledger: ledgerThemeManifest,
})

export type ThemeId = keyof typeof themeManifests

export const themeIds = Object.keys(themeManifests) as [ThemeId, ...ThemeId[]]
export const defaultThemeId: ThemeId = 'editorial'

export function getThemeManifest(id: ThemeId): ThemeManifest<ThemeId> {
  return themeManifests[id]
}
