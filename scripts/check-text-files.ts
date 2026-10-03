import { readdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, extname, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const writeMode = process.argv.includes('--write')

const excludedDirectories = new Set([
  '.agent',
  '.agents',
  '.git',
  '.playwright',
  '.playwright-cli',
  'artifacts',
  'coverage',
  'dist',
  'dist-ssr',
  'node_modules',
  'pdf',
  'playwright-report',
  'reports',
  'test-results',
])

const textExtensions = new Set([
  '.cjs',
  '.css',
  '.cts',
  '.html',
  '.htm',
  '.js',
  '.json',
  '.jsonc',
  '.less',
  '.md',
  '.mdx',
  '.mjs',
  '.mts',
  '.sass',
  '.scss',
  '.svg',
  '.ts',
  '.tsx',
  '.txt',
  '.vue',
  '.xml',
  '.yaml',
  '.yml',
])

const textFileNames = new Set([
  '.editorconfig',
  '.gitattributes',
  '.gitignore',
  '.gitmodules',
  '.npmrc',
  '.nvmrc',
  '.prettierignore',
  '.prettierrc',
  'Dockerfile',
  'LICENSE',
  'Makefile',
  'Procfile',
])

const unicodeAllowedFiles = new Set(['resume.yaml'])

interface Violation {
  path: string
  message: string
}

function normalizePath(path: string): string {
  return path.replaceAll('\\', '/')
}

function isTextFile(name: string): boolean {
  return textFileNames.has(name) || textExtensions.has(extname(name).toLowerCase())
}

async function collectTextFiles(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true })
  const files: string[] = []

  for (const entry of entries) {
    if (entry.isDirectory() && excludedDirectories.has(entry.name)) continue

    const path = resolve(directory, entry.name)
    if (entry.isDirectory()) {
      files.push(...(await collectTextFiles(path)))
    } else if (entry.isFile() && isTextFile(entry.name)) {
      files.push(path)
    }
  }

  return files
}

function firstNonAsciiLine(contents: string): number | undefined {
  let line = 1

  for (const character of contents) {
    if ((character.codePointAt(0) ?? 0) > 0x7f) return line
    if (character === '\n') line += 1
  }

  return undefined
}

function normalizeText(contents: string): string {
  return `${contents.replace(/\r\n?/g, '\n').replace(/\n+$/g, '')}\n`
}

const files = (await collectTextFiles(repositoryRoot)).sort()
const violations: Violation[] = []

for (const path of files) {
  const relativePath = normalizePath(relative(repositoryRoot, path))
  const bytes = await readFile(path)
  if (bytes.includes(0)) continue

  let contents = bytes.toString('utf8')

  if (writeMode) {
    const normalized = normalizeText(contents)
    if (normalized !== contents) {
      await writeFile(path, normalized, 'utf8')
      contents = normalized
    }
  }

  if (contents.includes('\r')) {
    violations.push({ path: relativePath, message: 'contains CR or CRLF; expected LF only' })
  }

  if (contents.length > 0 && !contents.endsWith('\n')) {
    violations.push({ path: relativePath, message: 'is missing its final LF newline' })
  }

  if (contents.endsWith('\n\n')) {
    violations.push({ path: relativePath, message: 'has more than one final LF newline' })
  }

  if (!unicodeAllowedFiles.has(relativePath)) {
    const line = firstNonAsciiLine(contents)
    if (line !== undefined) {
      violations.push({
        path: relativePath,
        message: `contains non-ASCII text at line ${line}; ASCII is required`,
      })
    }
  }
}

if (violations.length > 0) {
  console.error(`text-file-check: ${violations.length} violation(s)`)
  for (const violation of violations) {
    console.error(`ERROR ${violation.path}: ${violation.message}`)
  }
  process.exit(1)
}

console.log(`text-file-check: passed; checked ${files.length} authored text files`)
