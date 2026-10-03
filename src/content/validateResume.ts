import type { ResumeSource } from '@/schema/resumeSource'
import { resumeSourceSchema } from '@/schema/resumeSource'

import type { ResumeIssue, ResumeResult } from './result'

function normalizePath(path: PropertyKey[]): Array<string | number> {
  return path.map((part) =>
    typeof part === 'symbol' ? (part.description ?? part.toString()) : part,
  )
}

function collectSemanticIssues(resume: ResumeSource): ResumeIssue[] {
  const issues: ResumeIssue[] = []
  const sectionIds = new Set<string>()

  resume.sections.forEach((section, sectionIndex) => {
    if (section.id) {
      if (sectionIds.has(section.id)) {
        issues.push({
          stage: 'semantic',
          path: ['sections', sectionIndex, 'id'],
          message: `Section id "${section.id}" is duplicated`,
          code: 'duplicate_section_id',
        })
      }
      sectionIds.add(section.id)
    }

    if ('items' in section && section.items) {
      section.items.forEach((item, itemIndex) => {
        if ('start' in item && item.start && 'end' in item && item.end && item.end !== 'present') {
          if (item.end < item.start) {
            issues.push({
              stage: 'semantic',
              path: ['sections', sectionIndex, 'items', itemIndex, 'end'],
              message: 'End date cannot be earlier than start date',
              code: 'invalid_date_range',
            })
          }
        }

        if ('date' in item && item.date && 'expires' in item && item.expires) {
          if (item.expires !== 'present' && item.expires < item.date) {
            issues.push({
              stage: 'semantic',
              path: ['sections', sectionIndex, 'items', itemIndex, 'expires'],
              message: 'Expiration date cannot be earlier than issue date',
              code: 'invalid_date_range',
            })
          }
        }
      })
    }
  })

  return issues
}

export function validateResume(input: unknown): ResumeResult<ResumeSource> {
  const result = resumeSourceSchema.safeParse(input)

  if (!result.success) {
    return {
      success: false,
      issues: result.error.issues.map((issue) => ({
        stage: 'schema',
        path: normalizePath(issue.path),
        message: issue.message,
        code: issue.code,
      })),
    }
  }

  const semanticIssues = collectSemanticIssues(result.data)

  return semanticIssues.length > 0
    ? { success: false, issues: semanticIssues }
    : { success: true, data: result.data }
}
