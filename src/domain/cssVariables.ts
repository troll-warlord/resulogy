import type { ResolvedPresentation } from './resume'

const fontStacks: Record<ResolvedPresentation['typography']['fontFamily'], string> = {
  'source-sans-3': "'Source Sans 3 Variable', 'Segoe UI', sans-serif",
  'source-serif-4': "'Source Serif 4 Variable', Georgia, serif",
  'ibm-plex-sans': "'IBM Plex Sans Variable', 'Segoe UI', sans-serif",
}

const pageMargins: Record<ResolvedPresentation['page']['margin'], string> = {
  compact: '11mm',
  standard: '15mm',
  spacious: '19mm',
}

const densityScale: Record<ResolvedPresentation['density'], string> = {
  compact: '0.82',
  standard: '1',
  spacious: '1.18',
}

export function toResumeCssVariables(presentation: ResolvedPresentation): Record<string, string> {
  return {
    '--resume-font-family': fontStacks[presentation.typography.fontFamily],
    '--resume-base-size': `${presentation.typography.baseSize}pt`,
    '--resume-line-height': String(presentation.typography.lineHeight),
    '--resume-color-text': presentation.colors.text,
    '--resume-color-muted': presentation.colors.muted,
    '--resume-color-accent': presentation.colors.accent,
    '--resume-color-rule': presentation.colors.rule,
    '--resume-page-margin': pageMargins[presentation.page.margin],
    '--resume-density': densityScale[presentation.density],
  }
}
