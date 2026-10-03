export type PageSize = 'a4' | 'letter'
export type MarginPreset = 'compact' | 'standard' | 'spacious'
export type Density = 'compact' | 'standard' | 'spacious'
export type FontFamily = 'source-sans-3' | 'source-serif-4' | 'ibm-plex-sans'
export type BulletMarker = 'disc' | 'circle' | 'square' | 'dash' | 'chevron' | 'none'
export type BreakPolicy = 'auto' | 'avoid' | 'before' | 'after'

export interface ResolvedThemeSettings {
  page: {
    size: PageSize
    margin: MarginPreset
  }
  typography: {
    fontFamily: FontFamily
    baseSize: number
    lineHeight: number
  }
  colors: {
    text: string
    muted: string
    accent: string
    rule: string
  }
  density: Density
  bullets: {
    marker: BulletMarker
  }
}
