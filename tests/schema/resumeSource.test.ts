import { describe, expect, it } from 'vitest'

import { resumeSourceSchema } from '../../src/schema/resumeSource'

const validResume = {
  version: 1,
  basics: {
    name: 'Alex Johnson',
    label: 'Senior Full-Stack Engineer',
    email: 'alex.johnson@example.com',
  },
  presentation: {
    theme: 'editorial',
    page: { size: 'a4', margin: 'standard' },
    typography: { fontFamily: 'source-sans-3', baseSize: 10.5, lineHeight: 1.35 },
  },
  sections: [
    {
      type: 'summary',
      title: 'Profile',
      text: 'Engineer focused on resilient products and thoughtful developer experience.',
    },
    {
      type: 'experience',
      title: 'Experience',
      items: [
        {
          company: 'Northstar Labs',
          position: 'Senior Engineer',
          start: '2021-03',
          end: 'present',
          highlights: ['Led a platform modernization across four product teams.'],
        },
      ],
    },
  ],
} as const

describe('resumeSourceSchema', () => {
  it('accepts a valid version-one resume', () => {
    expect(resumeSourceSchema.parse(validResume)).toEqual(validResume)
  })

  it('rejects unknown fields', () => {
    const result = resumeSourceSchema.safeParse({
      ...validResume,
      unexpected: true,
    })

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0]?.code).toBe('unrecognized_keys')
    }
  })

  it('reports the path of a malformed year-month date', () => {
    const result = resumeSourceSchema.safeParse({
      ...validResume,
      sections: [
        {
          type: 'experience',
          items: [
            {
              company: 'Northstar Labs',
              position: 'Senior Engineer',
              start: 'March 2021',
            },
          ],
        },
      ],
    })

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0]?.path).toEqual(['sections', 0, 'items', 0, 'start'])
    }
  })
})
