import { z } from 'zod'

import { safeUrlSchema, shortTextSchema } from './common'
import { presentationSourceSchema } from './presentation'
import { sectionSourceSchema } from './sections'

const locationSchema = z.strictObject({
  city: shortTextSchema.optional(),
  region: shortTextSchema.optional(),
  country: shortTextSchema.optional(),
  postalCode: shortTextSchema.optional(),
})

const socialProfileSchema = z.strictObject({
  network: shortTextSchema,
  username: shortTextSchema.optional(),
  url: safeUrlSchema,
})

export const basicsSourceSchema = z.strictObject({
  name: shortTextSchema,
  label: shortTextSchema.optional(),
  email: z.email().optional(),
  phone: shortTextSchema.optional(),
  location: locationSchema.optional(),
  website: safeUrlSchema.optional(),
  social: z.array(socialProfileSchema).max(20).optional(),
})

export const resumeSourceSchema = z.strictObject({
  $schema: z.string().optional(),
  version: z.literal(1),
  basics: basicsSourceSchema,
  presentation: presentationSourceSchema.optional(),
  sections: z.array(sectionSourceSchema).min(1),
})

export type ResumeSource = z.infer<typeof resumeSourceSchema>
