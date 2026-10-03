import { z } from 'zod'

import { themeIds } from '@/themes/manifest'

import { bulletMarkerSchema } from './common'

const hexColorSchema = z
  .string()
  .regex(/^#[0-9a-fA-F]{6}$/, 'Expected a six-digit hexadecimal color')

export const themeIdSchema = z.enum(themeIds)
export const pageSizeSchema = z.enum(['a4', 'letter'])
export const marginPresetSchema = z.enum(['compact', 'standard', 'spacious'])
export const densitySchema = z.enum(['compact', 'standard', 'spacious'])
export const fontFamilySchema = z.enum(['source-sans-3', 'source-serif-4', 'ibm-plex-sans'])

export const presentationSourceSchema = z.strictObject({
  theme: themeIdSchema.optional(),
  page: z
    .strictObject({
      size: pageSizeSchema.optional(),
      margin: marginPresetSchema.optional(),
    })
    .optional(),
  typography: z
    .strictObject({
      fontFamily: fontFamilySchema.optional(),
      baseSize: z.number().min(8).max(14).optional(),
      lineHeight: z.number().min(1.15).max(1.7).optional(),
    })
    .optional(),
  colors: z
    .strictObject({
      text: hexColorSchema.optional(),
      muted: hexColorSchema.optional(),
      accent: hexColorSchema.optional(),
      rule: hexColorSchema.optional(),
    })
    .optional(),
  density: densitySchema.optional(),
  bullets: z
    .strictObject({
      marker: bulletMarkerSchema.optional(),
    })
    .optional(),
})

export type PresentationSource = z.infer<typeof presentationSourceSchema>
