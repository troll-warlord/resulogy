import { readFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { processResumeYaml } from '../src/content/processResumeYaml'
import { parsePdfCliOptions, pdfCliHelp, PdfCliUsageError } from './pdf/cliOptions'
import { exportResumePdf } from './pdf/exportResumePdf'

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')

function issueLocation(issue: {
  column?: number
  line?: number
  path: Array<string | number>
}): string {
  if (issue.line && issue.column) return `${issue.line}:${issue.column}`
  return issue.path.length > 0 ? issue.path.join('.') : '<root>'
}

async function main(): Promise<void> {
  const options = parsePdfCliOptions(process.argv.slice(2), {
    cwd: process.cwd(),
    repositoryRoot,
  })

  if (options.help) {
    console.log(pdfCliHelp())
    return
  }

  let source: string
  try {
    source = await readFile(options.inputPath, 'utf8')
  } catch (error) {
    throw new Error(
      `Unable to read input YAML at ${options.inputPath}: ${error instanceof Error ? error.message : String(error)}`,
      { cause: error },
    )
  }

  const processed = processResumeYaml(source)
  if (!processed.success) {
    const details = processed.issues
      .map((issue) => `  ${issueLocation(issue)}: ${issue.message}`)
      .join('\n')
    throw new Error(`Resume YAML is invalid:\n${details}`)
  }

  const exported = await exportResumePdf({
    expectedName: processed.data.basics.name,
    outputPath: options.outputPath,
    repositoryRoot,
    source,
  })

  console.log(`Generated PDF: ${exported.outputPath}`)
  console.log(`Input YAML: ${options.inputPath}`)
  console.log(`Pages: ${exported.pageCount}`)
  console.log(
    `First page: ${exported.widthPoints.toFixed(2)} x ${exported.heightPoints.toFixed(2)} pt`,
  )
}

main().catch((error: unknown) => {
  if (error instanceof PdfCliUsageError) {
    console.error(`PDF usage error: ${error.message}\n`)
    console.error(pdfCliHelp())
  } else {
    console.error(error instanceof Error ? error.message : String(error))
  }
  process.exitCode = 1
})
