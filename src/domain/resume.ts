import type { ResumeSource } from '@/schema/resumeSource'
import type { SectionSource } from '@/schema/sections'
import type { ThemeId } from '@/themes/manifest'

import type { BreakPolicy, BulletMarker, ResolvedThemeSettings } from './presentation'

export type {
  BreakPolicy,
  BulletMarker,
  Density,
  FontFamily,
  MarginPreset,
  PageSize,
} from './presentation'
export type { ThemeId } from '@/themes/manifest'

export interface ResolvedPresentation extends ResolvedThemeSettings {
  theme: ThemeId
}

type NormalizedSectionMember<T extends SectionSource> = Omit<
  T,
  'id' | 'title' | 'visible' | 'options'
> & {
  id: string
  title: string
  visible: true
  options: {
    breakPolicy: BreakPolicy
    bulletMarker: BulletMarker
  }
}

export type NormalizedSection = SectionSource extends infer Section
  ? Section extends SectionSource
    ? NormalizedSectionMember<Section>
    : never
  : never

export interface NormalizedResume {
  version: 1
  basics: ResumeSource['basics']
  presentation: ResolvedPresentation
  sections: NormalizedSection[]
}
