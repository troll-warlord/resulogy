import type { NormalizedResume, NormalizedSection, ResolvedPresentation } from '@/domain/resume'
import type { ResumeSource } from '@/schema/resumeSource'
import type { SectionSource } from '@/schema/sections'
import { defaultThemeId, getThemeManifest } from '@/themes/manifest'

const defaultSectionTitles: Record<SectionSource['type'], string> = {
  summary: 'Profile',
  experience: 'Experience',
  projects: 'Projects',
  education: 'Education',
  skills: 'Skills',
  certifications: 'Certifications',
  awards: 'Awards',
  volunteering: 'Volunteering',
  publications: 'Publications',
  languages: 'Languages',
  interests: 'Interests',
  custom: 'Additional Information',
}

export const defaultPresentation: ResolvedPresentation = {
  theme: defaultThemeId,
  ...getThemeManifest(defaultThemeId).defaults,
}

function trimStrings<T>(value: T): T {
  if (typeof value === 'string') {
    return value.trim() as T
  }

  if (Array.isArray(value)) {
    return value.map(trimStrings) as T
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, nestedValue]) => [key, trimStrings(nestedValue)]),
    ) as T
  }

  return value
}

function resolvePresentation(source: ResumeSource['presentation']): ResolvedPresentation {
  const themeId = source?.theme ?? defaultPresentation.theme
  const themeDefaults = getThemeManifest(themeId).defaults

  return {
    theme: themeId,
    page: {
      size: source?.page?.size ?? themeDefaults.page.size,
      margin: source?.page?.margin ?? themeDefaults.page.margin,
    },
    typography: {
      fontFamily: source?.typography?.fontFamily ?? themeDefaults.typography.fontFamily,
      baseSize: source?.typography?.baseSize ?? themeDefaults.typography.baseSize,
      lineHeight: source?.typography?.lineHeight ?? themeDefaults.typography.lineHeight,
    },
    colors: {
      text: source?.colors?.text ?? themeDefaults.colors.text,
      muted: source?.colors?.muted ?? themeDefaults.colors.muted,
      accent: source?.colors?.accent ?? themeDefaults.colors.accent,
      rule: source?.colors?.rule ?? themeDefaults.colors.rule,
    },
    density: source?.density ?? themeDefaults.density,
    bullets: {
      marker: source?.bullets?.marker ?? themeDefaults.bullets.marker,
    },
  }
}

export function normalizeResume(source: ResumeSource): NormalizedResume {
  const trimmedSource = trimStrings(source)
  const presentation = resolvePresentation(trimmedSource.presentation)
  const typeCounts = new Map<SectionSource['type'], number>()

  const sections = trimmedSource.sections
    .filter((section) => section.visible !== false)
    .map((section): NormalizedSection => {
      const count = (typeCounts.get(section.type) ?? 0) + 1
      typeCounts.set(section.type, count)

      return {
        ...section,
        id: section.id ?? `${section.type}-${count}`,
        title: section.title ?? defaultSectionTitles[section.type],
        visible: true,
        options: {
          breakPolicy: section.options?.breakPolicy ?? 'auto',
          bulletMarker: section.options?.bulletMarker ?? presentation.bullets.marker,
        },
      } as NormalizedSection
    })

  return {
    version: 1,
    basics: trimmedSource.basics,
    presentation,
    sections,
  }
}
