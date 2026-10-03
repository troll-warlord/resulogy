import { faLinkedin } from '@fortawesome/free-brands-svg-icons'
import {
  siBehance,
  siBluesky,
  siCredly,
  siDevdotto,
  siDribbble,
  siGithub,
  siGitlab,
  siGooglescholar,
  siHackerrank,
  siHashnode,
  siLeetcode,
  siMastodon,
  siMedium,
  siNpm,
  siOrcid,
  siResearchgate,
  siStackoverflow,
  siX,
  siYoutube,
} from 'simple-icons'

export interface BrandIconDefinition {
  id: string
  title: string
  viewBox: string
  paths: string[]
}

function simpleIcon(id: string, icon: { title: string; path: string }): BrandIconDefinition {
  return {
    id,
    title: icon.title,
    viewBox: '0 0 24 24',
    paths: [icon.path],
  }
}

function fontAwesomeIcon(
  id: string,
  title: string,
  definition: typeof faLinkedin,
): BrandIconDefinition {
  const [width, height, , , pathData] = definition.icon
  return {
    id,
    title,
    viewBox: `0 0 ${width} ${height}`,
    paths: Array.isArray(pathData) ? pathData : [pathData],
  }
}

const icons = {
  behance: simpleIcon('behance', siBehance),
  bluesky: simpleIcon('bluesky', siBluesky),
  credly: simpleIcon('credly', siCredly),
  devdotto: simpleIcon('devdotto', siDevdotto),
  dribbble: simpleIcon('dribbble', siDribbble),
  github: simpleIcon('github', siGithub),
  gitlab: simpleIcon('gitlab', siGitlab),
  googlescholar: simpleIcon('googlescholar', siGooglescholar),
  hackerrank: simpleIcon('hackerrank', siHackerrank),
  hashnode: simpleIcon('hashnode', siHashnode),
  leetcode: simpleIcon('leetcode', siLeetcode),
  linkedin: fontAwesomeIcon('linkedin', 'LinkedIn', faLinkedin),
  mastodon: simpleIcon('mastodon', siMastodon),
  medium: simpleIcon('medium', siMedium),
  npm: simpleIcon('npm', siNpm),
  orcid: simpleIcon('orcid', siOrcid),
  researchgate: simpleIcon('researchgate', siResearchgate),
  stackoverflow: simpleIcon('stackoverflow', siStackoverflow),
  x: simpleIcon('x', siX),
  youtube: simpleIcon('youtube', siYoutube),
} satisfies Record<string, BrandIconDefinition>

type BrandIconId = keyof typeof icons

const aliases: Record<string, BrandIconId> = {
  behance: 'behance',
  bluesky: 'bluesky',
  credly: 'credly',
  dev: 'devdotto',
  devto: 'devdotto',
  devdotto: 'devdotto',
  dribbble: 'dribbble',
  github: 'github',
  gitlab: 'gitlab',
  googlescholar: 'googlescholar',
  hackerrank: 'hackerrank',
  hashnode: 'hashnode',
  leetcode: 'leetcode',
  linkedin: 'linkedin',
  mastodon: 'mastodon',
  medium: 'medium',
  npm: 'npm',
  orcid: 'orcid',
  researchgate: 'researchgate',
  stackoverflow: 'stackoverflow',
  twitter: 'x',
  x: 'x',
  youtube: 'youtube',
}

function normalizeNetwork(network: string): string {
  return network.toLowerCase().replace(/[^a-z0-9]/g, '')
}

export function getBrandIcon(network: string): BrandIconDefinition | undefined {
  const iconId = aliases[normalizeNetwork(network)]
  return iconId ? icons[iconId] : undefined
}
