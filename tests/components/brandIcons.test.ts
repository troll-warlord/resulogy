import { describe, expect, it } from 'vitest'

import { getBrandIcon } from '../../src/components/resume/brandIcons'

describe('brand icon registry', () => {
  it.each([
    ['GitHub', 'github'],
    ['LinkedIn', 'linkedin'],
    ['Credly', 'credly'],
    ['GitLab', 'gitlab'],
    ['Stack Overflow', 'stackoverflow'],
    ['Twitter', 'x'],
    ['X', 'x'],
    ['Mastodon', 'mastodon'],
    ['Bluesky', 'bluesky'],
    ['YouTube', 'youtube'],
    ['Medium', 'medium'],
    ['DEV.to', 'devdotto'],
    ['Hashnode', 'hashnode'],
    ['npm', 'npm'],
    ['Google Scholar', 'googlescholar'],
    ['HackerRank', 'hackerrank'],
    ['LeetCode', 'leetcode'],
    ['ORCID', 'orcid'],
    ['ResearchGate', 'researchgate'],
    ['Behance', 'behance'],
    ['Dribbble', 'dribbble'],
  ])('maps %s to the stable %s icon id', (network, iconId) => {
    expect(getBrandIcon(network)?.id).toBe(iconId)
  })

  it('returns undefined for an unknown network', () => {
    expect(getBrandIcon('Personal Community')).toBeUndefined()
  })
})
