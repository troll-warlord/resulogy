import { resolve } from 'node:path'

import { describe, expect, it } from 'vitest'

import { parsePdfCliOptions, PdfCliUsageError } from '../../scripts/pdf/cliOptions'

const context = {
  cwd: resolve('working directory'),
  repositoryRoot: resolve('repository'),
}

describe('PDF CLI options', () => {
  it('defaults to root resume.yaml and pdf/resume.pdf', () => {
    expect(parsePdfCliOptions([], context)).toEqual({
      help: false,
      inputPath: resolve(context.repositoryRoot, 'resume.yaml'),
      outputPath: resolve(context.repositoryRoot, 'pdf', 'resume.pdf'),
    })
  })

  it('uses an alternate input basename in the dedicated PDF folder', () => {
    const options = parsePdfCliOptions(['-i', 'profiles/Jane Candidate.yaml'], context)

    expect(options.inputPath).toBe(resolve(context.cwd, 'profiles/Jane Candidate.yaml'))
    expect(options.outputPath).toBe(resolve(context.repositoryRoot, 'pdf', 'Jane Candidate.pdf'))
  })

  it('resolves an explicit output from the caller working directory', () => {
    const options = parsePdfCliOptions(
      ['--input', 'profiles/jane.yml', '--output', 'exports/custom.pdf'],
      context,
    )

    expect(options.outputPath).toBe(resolve(context.cwd, 'exports/custom.pdf'))
  })

  it('supports help without changing path defaults', () => {
    expect(parsePdfCliOptions(['--help'], context).help).toBe(true)
  })

  it.each([
    [['candidate.json'], 'Unexpected positional argument'],
    [['--input', 'candidate.json'], 'Input must use .yaml or .yml'],
    [['--output', 'candidate.txt'], 'Output must use .pdf'],
    [['--input', 'one.yaml', '-i', 'two.yaml'], 'Input may be specified only once'],
  ])('rejects invalid arguments', (args, message) => {
    expect(() => parsePdfCliOptions(args, context)).toThrowError(message)
  })

  it('uses a dedicated usage error type', () => {
    expect(() => parsePdfCliOptions(['candidate.yaml'], context)).toThrow(PdfCliUsageError)
  })
})
