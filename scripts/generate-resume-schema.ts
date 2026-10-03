import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

import { format, resolveConfig } from 'prettier'
import { z } from 'zod'

import { resumeSourceSchema } from '../src/schema/resumeSource'

const outputPath = resolve('resume.schema.json')
const checkOnly = process.argv.includes('--check')

const generatedSchema = z.toJSONSchema(resumeSourceSchema, {
  io: 'input',
  reused: 'ref',
  target: 'draft-2020-12',
})

const prettierConfig = await resolveConfig(outputPath)
const contents = await format(
  JSON.stringify({
    ...generatedSchema,
    $id: 'https://resulogy.dev/schema/resume.schema.json',
    title: 'Resulogy resume',
    description: 'A versioned resume document rendered by Resulogy.',
  }),
  {
    ...prettierConfig,
    filepath: outputPath,
  },
)

if (checkOnly) {
  const currentContents = await readFile(outputPath, 'utf8').catch(() => '')

  if (currentContents !== contents) {
    console.error('resume.schema.json is out of date. Run npm run schema:generate.')
    process.exitCode = 1
  }
} else {
  await writeFile(outputPath, contents)
  console.log('Generated resume.schema.json')
}
