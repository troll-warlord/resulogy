import { LineCounter, parseDocument } from 'yaml'

import type { ResumeResult } from './result'

export function parseResumeYaml(source: string): ResumeResult<unknown> {
  const lineCounter = new LineCounter()
  const document = parseDocument(source, {
    lineCounter,
    prettyErrors: true,
    strict: true,
    uniqueKeys: true,
    version: '1.2',
  })

  if (document.errors.length > 0) {
    return {
      success: false,
      issues: document.errors.map((error) => ({
        stage: 'yaml',
        path: [],
        message: error.message,
        code: error.code,
        line: error.linePos?.[0].line,
        column: error.linePos?.[0].col,
      })),
    }
  }

  return { success: true, data: document.toJS({ maxAliasCount: 20 }) }
}
