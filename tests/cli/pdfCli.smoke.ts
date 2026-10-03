import { strict as assert } from 'node:assert'
import { access, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'

import { PDFDocument } from 'pdf-lib'
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs'

import { processResumeYaml } from '../../src/content/processResumeYaml'
import { exportResumePdf } from '../../scripts/pdf/exportResumePdf'

const repositoryRoot = resolve('.')

async function pdfText(bytes: Buffer): Promise<string> {
  const loadingTask = getDocument({ data: Uint8Array.from(bytes) })
  const document = await loadingTask.promise
  const pages: string[] = []

  try {
    for (let index = 1; index <= document.numPages; index += 1) {
      const page = await document.getPage(index)
      const content = await page.getTextContent()
      pages.push(
        content.items
          .filter((item) => 'str' in item)
          .map((item) => item.str)
          .join(' '),
      )
    }
  } finally {
    await loadingTask.destroy()
  }

  return pages.join(' ')
}

async function smokeTest(): Promise<void> {
  const temporaryDirectory = await mkdtemp(join(tmpdir(), 'resulogy pdf cli '))
  const inputPath = join(temporaryDirectory, 'alternate candidate.yaml')
  const outputPath = join(temporaryDirectory, 'exports', 'alternate candidate.pdf')
  const invalidInputPath = join(temporaryDirectory, 'invalid.yaml')
  const invalidOutputPath = join(temporaryDirectory, 'invalid.pdf')

  try {
    const source = `
version: 1
basics:
  name: CLI Candidate
  label: Reliability Engineer
  email: cli.candidate@example.com
  social:
    - network: GitHub
      username: cli-candidate
      url: https://github.com/cli-candidate
presentation:
  theme: editorial
  page:
    size: letter
    margin: standard
sections:
  - type: summary
    text: This resume was rendered from an alternate YAML file outside the repository.
    highlights:
      - Builds reliable delivery systems that keep extracted job-portal text free from decorative marker characters.
`
    await writeFile(inputPath, source, 'utf8')

    const processed = processResumeYaml(await readFile(inputPath, 'utf8'))
    assert.equal(processed.success, true)
    if (!processed.success) throw new Error('Alternate smoke-test YAML did not validate.')

    const exported = await exportResumePdf({
      expectedName: processed.data.basics.name,
      outputPath,
      repositoryRoot,
      source,
      timeoutMs: 30_000,
    })

    const bytes = await readFile(outputPath)
    const pdf = await PDFDocument.load(bytes)
    const firstPage = pdf.getPages()[0]
    const text = await pdfText(bytes)

    assert.ok(bytes.byteLength > 1_000)
    assert.equal(exported.outputPath, outputPath)
    assert.equal(exported.pageCount, 1)
    assert.ok(firstPage)
    assert.ok(Math.abs(firstPage.getWidth() - 612) < 1)
    assert.ok(Math.abs(firstPage.getHeight() - 792) < 1)
    assert.ok((firstPage.node.Annots()?.size() ?? 0) >= 2)
    assert.match(text, /CLI Candidate/)
    assert.match(text, /alternate YAML file outside the repository/)
    assert.doesNotMatch(text, /Alex Johnson/)
    assert.doesNotMatch(text, />/)
    assert.doesNotMatch(text, /\*/)

    const invalidSource = `
version: 1
basics:
  name: Invalid Candidate
sections:
  - type: experience
    items:
      - company: Example Company
        position: Engineer
        start: 2025-01
        end: 2024-12
`
    await writeFile(invalidInputPath, invalidSource, 'utf8')

    const invalid = processResumeYaml(await readFile(invalidInputPath, 'utf8'))
    assert.equal(invalid.success, false)
    if (invalid.success) throw new Error('Invalid smoke-test YAML unexpectedly validated.')
    assert.match(invalid.issues[0]?.message ?? '', /End date cannot be earlier/)
    await assert.rejects(access(invalidOutputPath))
  } finally {
    await rm(temporaryDirectory, { recursive: true, force: true })
  }
}

smokeTest()
  .then(() => console.log('PDF CLI smoke test passed.'))
  .catch((error: unknown) => {
    console.error(error instanceof Error ? error.stack : String(error))
    process.exitCode = 1
  })
