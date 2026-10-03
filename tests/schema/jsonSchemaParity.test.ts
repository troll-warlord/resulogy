import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'

import Ajv2020 from 'ajv/dist/2020.js'
import addFormats from 'ajv-formats'
import { describe, expect, it } from 'vitest'

import { parseResumeYaml } from '../../src/content/parseResumeYaml'
import { resumeSourceSchema } from '../../src/schema/resumeSource'

async function loadGeneratedSchema(): Promise<object> {
  return JSON.parse(await readFile(resolve('resume.schema.json'), 'utf8')) as object
}

describe('generated resume JSON Schema', () => {
  it('accepts the same project resume as the runtime Zod schema', async () => {
    const source = await readFile(resolve('resume.yaml'), 'utf8')
    const parsed = parseResumeYaml(source)
    expect(parsed.success).toBe(true)
    if (!parsed.success) return

    const validate = addFormats(new Ajv2020({ allErrors: true, strict: true })).compile(
      await loadGeneratedSchema(),
    )

    expect(resumeSourceSchema.safeParse(parsed.data).success).toBe(true)
    expect(validate(parsed.data), validate.errors?.map((error) => error.message).join('\n')).toBe(
      true,
    )
  })

  it('rejects unknown top-level fields in both contracts', async () => {
    const invalid = {
      version: 1,
      basics: { name: 'Alex Johnson' },
      sections: [{ type: 'summary', text: 'A focused engineer.' }],
      typo: true,
    }
    const validate = addFormats(new Ajv2020({ allErrors: true, strict: true })).compile(
      await loadGeneratedSchema(),
    )

    expect(resumeSourceSchema.safeParse(invalid).success).toBe(false)
    expect(validate(invalid)).toBe(false)
  })
})
