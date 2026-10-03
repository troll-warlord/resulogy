import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'

import { describe, expect, it } from 'vitest'

import { loadResume } from '../../src/content/loadResume'
import { parseResumeYaml } from '../../src/content/parseResumeYaml'
import { processResumeYaml } from '../../src/content/processResumeYaml'
import { validateResume } from '../../src/content/validateResume'
import { toResumeCssVariables } from '../../src/domain/cssVariables'

describe('resume data pipeline', () => {
  it('parses, validates, and normalizes the project resume', async () => {
    const source = await readFile(resolve('resume.yaml'), 'utf8')
    const processed = processResumeYaml(source)
    const bundled = loadResume()

    expect(processed.success).toBe(true)
    expect(bundled.success).toBe(true)
    if (!processed.success || !bundled.success) return

    const resume = processed.data

    expect(resume.basics.name).toBe('Alex Johnson')
    expect(resume).toEqual(bundled.data)
    expect(resume.sections.map((section) => section.id)).toEqual([
      'summary-1',
      'experience-1',
      'projects-1',
      'skills-1',
      'education-1',
      'certifications-1',
      'awards-1',
      'volunteering-1',
      'publications-1',
      'languages-1',
      'interests-1',
      'custom-1',
    ])
    expect(resume.presentation.page.size).toBe('a4')
  })

  it('returns path-aware issues for invalid explicit YAML', () => {
    const result = processResumeYaml(`
version: 1
basics:
  name: Alternate Candidate
sections:
  - type: experience
    items:
      - company: Example Company
        position: Engineer
        start: 2025-01
        end: 2024-12
`)

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.issues[0]).toMatchObject({
        stage: 'semantic',
        path: ['sections', 0, 'items', 0, 'end'],
      })
    }
  })

  it('reports YAML line information for duplicate keys', () => {
    const parsed = parseResumeYaml('version: 1\nversion: 1\n')

    expect(parsed.success).toBe(false)
    if (!parsed.success) {
      expect(parsed.issues[0]?.stage).toBe('yaml')
      expect(parsed.issues[0]?.line).toBe(2)
    }
  })

  it('rejects end dates earlier than start dates', () => {
    const result = validateResume({
      version: 1,
      basics: { name: 'Alex Johnson' },
      sections: [
        {
          type: 'experience',
          items: [
            {
              company: 'Northstar Labs',
              position: 'Engineer',
              start: '2022-01',
              end: '2021-12',
            },
          ],
        },
      ],
    })

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.issues[0]).toMatchObject({
        stage: 'semantic',
        path: ['sections', 0, 'items', 0, 'end'],
        code: 'invalid_date_range',
      })
    }
  })

  it('serializes only resolved presentation values into CSS variables', () => {
    const variables = toResumeCssVariables({
      theme: 'editorial',
      page: { size: 'letter', margin: 'compact' },
      typography: { fontFamily: 'ibm-plex-sans', baseSize: 11, lineHeight: 1.3 },
      colors: {
        text: '#111111',
        muted: '#555555',
        accent: '#006699',
        rule: '#dddddd',
      },
      density: 'compact',
      bullets: { marker: 'dash' },
    })

    expect(variables).toMatchObject({
      '--resume-font-family': "'IBM Plex Sans Variable', 'Segoe UI', sans-serif",
      '--resume-page-margin': '11mm',
    })
    expect(variables).not.toHaveProperty('--resume-bullet-marker')
  })
})
