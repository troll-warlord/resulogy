import { z } from 'zod'

export const nonEmptyTextSchema = z.string().min(1).max(2_000).regex(/\S/, 'Cannot be blank')

export const shortTextSchema = z.string().min(1).max(160).regex(/\S/, 'Cannot be blank')

export const yearMonthSchema = z
  .string()
  .regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'Expected a date in YYYY-MM format')

export const endDateSchema = z.union([yearMonthSchema, z.literal('present')])

export const safeUrlSchema = z.url().refine((value) => {
  const protocol = new URL(value).protocol
  return protocol === 'http:' || protocol === 'https:'
}, 'Only HTTP and HTTPS URLs are supported')

export const bulletMarkerSchema = z.enum(['disc', 'circle', 'square', 'dash', 'chevron', 'none'])

export const breakPolicySchema = z.enum(['auto', 'avoid', 'before', 'after'])

export const dateRangeShape = {
  start: yearMonthSchema,
  end: endDateSchema.optional(),
}
