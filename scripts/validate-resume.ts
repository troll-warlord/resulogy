import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'

import { normalizeResume } from '../src/content/normalizeResume'
import { parseResumeYaml } from '../src/content/parseResumeYaml'
import { validateResume } from '../src/content/validateResume'

const source = await readFile(resolve('resume.yaml'), 'utf8')
const parsed = parseResumeYaml(source)

if (!parsed.success) {
  for (const issue of parsed.issues) {
    console.error(`${issue.line ?? '?'}:${issue.column ?? '?'} ${issue.message}`)
  }
  process.exit(1)
}

const validated = validateResume(parsed.data)

if (!validated.success) {
  for (const issue of validated.issues) {
    const path = issue.path.length > 0 ? issue.path.join('.') : '<root>'
    console.error(`${path}: ${issue.message}`)
  }
  process.exit(1)
}

const resume = normalizeResume(validated.data)
console.log(`Validated ${resume.basics.name}'s resume with ${resume.sections.length} sections.`)
