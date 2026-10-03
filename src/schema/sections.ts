import { z } from 'zod'

import {
  breakPolicySchema,
  bulletMarkerSchema,
  dateRangeShape,
  endDateSchema,
  nonEmptyTextSchema,
  safeUrlSchema,
  shortTextSchema,
  yearMonthSchema,
} from './common'

const sectionOptionsSchema = z.strictObject({
  breakPolicy: breakPolicySchema.optional(),
  bulletMarker: bulletMarkerSchema.optional(),
})

const sectionBaseShape = {
  id: z
    .string()
    .regex(/^[a-z][a-z0-9-]*$/)
    .optional(),
  title: shortTextSchema.optional(),
  visible: z.boolean().optional(),
  options: sectionOptionsSchema.optional(),
}

const highlightsSchema = z.array(nonEmptyTextSchema).max(30).optional()

export const summarySectionSourceSchema = z
  .strictObject({
    type: z.literal('summary'),
    ...sectionBaseShape,
    text: nonEmptyTextSchema.optional(),
    highlights: highlightsSchema,
  })
  .refine((section) => section.text || section.highlights?.length, {
    message: 'Summary requires text or at least one highlight',
  })

const experienceItemSchema = z.strictObject({
  company: shortTextSchema,
  position: shortTextSchema,
  location: shortTextSchema.optional(),
  url: safeUrlSchema.optional(),
  ...dateRangeShape,
  summary: nonEmptyTextSchema.optional(),
  highlights: highlightsSchema,
  keywords: z.array(shortTextSchema).max(30).optional(),
})

export const experienceSectionSourceSchema = z.strictObject({
  type: z.literal('experience'),
  ...sectionBaseShape,
  layout: z.enum(['stacked', 'timeline']).optional(),
  items: z.array(experienceItemSchema).min(1),
})

const projectItemSchema = z.strictObject({
  name: shortTextSchema,
  role: shortTextSchema.optional(),
  url: safeUrlSchema.optional(),
  repository: safeUrlSchema.optional(),
  start: yearMonthSchema.optional(),
  end: endDateSchema.optional(),
  summary: nonEmptyTextSchema.optional(),
  highlights: highlightsSchema,
  technologies: z.array(shortTextSchema).max(30).optional(),
})

export const projectsSectionSourceSchema = z.strictObject({
  type: z.literal('projects'),
  ...sectionBaseShape,
  layout: z.enum(['stacked', 'compact']).optional(),
  items: z.array(projectItemSchema).min(1),
})

const educationItemSchema = z.strictObject({
  institution: shortTextSchema,
  studyType: shortTextSchema.optional(),
  area: shortTextSchema.optional(),
  location: shortTextSchema.optional(),
  url: safeUrlSchema.optional(),
  ...dateRangeShape,
  score: shortTextSchema.optional(),
  honors: z.array(shortTextSchema).max(20).optional(),
  courses: z.array(shortTextSchema).max(30).optional(),
  highlights: highlightsSchema,
})

export const educationSectionSourceSchema = z.strictObject({
  type: z.literal('education'),
  ...sectionBaseShape,
  layout: z.enum(['stacked', 'compact']).optional(),
  items: z.array(educationItemSchema).min(1),
})

const skillGroupSchema = z.strictObject({
  name: shortTextSchema,
  items: z.array(shortTextSchema).min(1).max(50),
  level: shortTextSchema.optional(),
})

export const skillsSectionSourceSchema = z.strictObject({
  type: z.literal('skills'),
  ...sectionBaseShape,
  layout: z.enum(['inline', 'grid', 'stacked']).optional(),
  columns: z.number().int().min(1).max(3).optional(),
  items: z.array(skillGroupSchema).min(1),
})

const certificationItemSchema = z.strictObject({
  name: shortTextSchema,
  issuer: shortTextSchema.optional(),
  date: yearMonthSchema.optional(),
  expires: endDateSchema.optional(),
  credentialId: shortTextSchema.optional(),
  url: safeUrlSchema.optional(),
  highlights: highlightsSchema,
})

export const certificationsSectionSourceSchema = z.strictObject({
  type: z.literal('certifications'),
  ...sectionBaseShape,
  layout: z.enum(['stacked', 'compact']).optional(),
  items: z.array(certificationItemSchema).min(1),
})

const awardItemSchema = z.strictObject({
  title: shortTextSchema,
  awarder: shortTextSchema.optional(),
  date: yearMonthSchema.optional(),
  summary: nonEmptyTextSchema.optional(),
  highlights: highlightsSchema,
  url: safeUrlSchema.optional(),
})

export const awardsSectionSourceSchema = z.strictObject({
  type: z.literal('awards'),
  ...sectionBaseShape,
  layout: z.enum(['stacked', 'compact']).optional(),
  items: z.array(awardItemSchema).min(1),
})

const volunteeringItemSchema = z.strictObject({
  organization: shortTextSchema,
  position: shortTextSchema.optional(),
  location: shortTextSchema.optional(),
  url: safeUrlSchema.optional(),
  ...dateRangeShape,
  summary: nonEmptyTextSchema.optional(),
  highlights: highlightsSchema,
})

export const volunteeringSectionSourceSchema = z.strictObject({
  type: z.literal('volunteering'),
  ...sectionBaseShape,
  layout: z.enum(['stacked', 'compact']).optional(),
  items: z.array(volunteeringItemSchema).min(1),
})

const publicationItemSchema = z.strictObject({
  name: shortTextSchema,
  publisher: shortTextSchema.optional(),
  date: yearMonthSchema.optional(),
  url: safeUrlSchema.optional(),
  authors: z.array(shortTextSchema).max(30).optional(),
  summary: nonEmptyTextSchema.optional(),
})

export const publicationsSectionSourceSchema = z.strictObject({
  type: z.literal('publications'),
  ...sectionBaseShape,
  layout: z.enum(['stacked', 'compact']).optional(),
  items: z.array(publicationItemSchema).min(1),
})

const languageItemSchema = z.strictObject({
  name: shortTextSchema,
  fluency: shortTextSchema.optional(),
})

export const languagesSectionSourceSchema = z.strictObject({
  type: z.literal('languages'),
  ...sectionBaseShape,
  layout: z.enum(['inline', 'grid', 'stacked']).optional(),
  columns: z.number().int().min(1).max(3).optional(),
  items: z.array(languageItemSchema).min(1),
})

const interestItemSchema = z.strictObject({
  name: shortTextSchema,
  keywords: z.array(shortTextSchema).max(30).optional(),
})

export const interestsSectionSourceSchema = z.strictObject({
  type: z.literal('interests'),
  ...sectionBaseShape,
  layout: z.enum(['inline', 'grid', 'stacked']).optional(),
  columns: z.number().int().min(1).max(3).optional(),
  items: z.array(interestItemSchema).min(1),
})

const customItemSchema = z
  .strictObject({
    heading: shortTextSchema.optional(),
    subheading: shortTextSchema.optional(),
    meta: shortTextSchema.optional(),
    text: nonEmptyTextSchema.optional(),
    url: safeUrlSchema.optional(),
    highlights: highlightsSchema,
  })
  .refine(
    (item) =>
      item.heading ||
      item.subheading ||
      item.meta ||
      item.text ||
      item.url ||
      item.highlights?.length,
    { message: 'Custom item cannot be empty' },
  )

export const customSectionSourceSchema = z
  .strictObject({
    type: z.literal('custom'),
    ...sectionBaseShape,
    layout: z.enum(['stacked', 'compact']).optional(),
    body: nonEmptyTextSchema.optional(),
    items: z.array(customItemSchema).min(1).optional(),
  })
  .refine((section) => section.body || section.items?.length, {
    message: 'Custom section requires a body or at least one item',
  })

export const sectionSourceSchema = z.discriminatedUnion('type', [
  summarySectionSourceSchema,
  experienceSectionSourceSchema,
  projectsSectionSourceSchema,
  educationSectionSourceSchema,
  skillsSectionSourceSchema,
  certificationsSectionSourceSchema,
  awardsSectionSourceSchema,
  volunteeringSectionSourceSchema,
  publicationsSectionSourceSchema,
  languagesSectionSourceSchema,
  interestsSectionSourceSchema,
  customSectionSourceSchema,
])

export type SectionSource = z.infer<typeof sectionSourceSchema>
