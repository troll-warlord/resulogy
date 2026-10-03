import type { ThemeManifest } from '../themeTypes'

export const editorialThemeManifest: ThemeManifest<'editorial'> = {
  id: 'editorial',
  label: 'Editorial',
  description: 'A restrained single-column resume optimized for scanning and print.',
  defaults: {
    page: {
      size: 'a4',
      margin: 'standard',
    },
    typography: {
      fontFamily: 'source-sans-3',
      baseSize: 10.5,
      lineHeight: 1.4,
    },
    colors: {
      text: '#202124',
      muted: '#5f6873',
      accent: '#176b87',
      rule: '#d8dde3',
    },
    density: 'standard',
    bullets: {
      marker: 'disc',
    },
  },
}
