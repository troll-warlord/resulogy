import type { ThemeManifest } from '../themeTypes'

export const ledgerThemeManifest: ThemeManifest<'ledger'> = {
  id: 'ledger',
  label: 'Ledger',
  description: 'A structured Swiss-inspired resume with a compact section rail.',
  defaults: {
    page: {
      size: 'a4',
      margin: 'standard',
    },
    typography: {
      fontFamily: 'ibm-plex-sans',
      baseSize: 10,
      lineHeight: 1.35,
    },
    colors: {
      text: '#22272b',
      muted: '#5d666d',
      accent: '#a74732',
      rule: '#cbd1d5',
    },
    density: 'standard',
    bullets: {
      marker: 'dash',
    },
  },
}
