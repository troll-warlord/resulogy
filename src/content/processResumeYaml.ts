import type { NormalizedResume } from '@/domain/resume'

import { normalizeResume } from './normalizeResume'
import { parseResumeYaml } from './parseResumeYaml'
import type { ResumeResult } from './result'
import { validateResume } from './validateResume'

export function processResumeYaml(source: string): ResumeResult<NormalizedResume> {
  const parsed = parseResumeYaml(source)
  if (!parsed.success) return parsed

  const validated = validateResume(parsed.data)
  if (!validated.success) return validated

  return { success: true, data: normalizeResume(validated.data) }
}
