export interface ResumeIssue {
  stage: 'yaml' | 'schema' | 'semantic'
  path: Array<string | number>
  message: string
  code: string
  line?: number
  column?: number
}

export type ResumeResult<T> = { success: true; data: T } | { success: false; issues: ResumeIssue[] }
