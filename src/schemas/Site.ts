import { z } from 'zod'
import { EntrySchema } from './Entry'

export const SiteSchema = EntrySchema.extend({
  name: z.string(),
  system: z.string().optional(),
  posterURL: z.string().optional(),
  hidden: z.boolean(),
  avatarURL: z.string().optional(),
  homepage: z.string().optional(),
  description: z.string().optional(),
  owners: z.array(z.string()),
})

export type Site = z.infer<typeof SiteSchema>
