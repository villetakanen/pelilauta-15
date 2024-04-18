import { z } from 'zod'

export const SiteSchema = z.object({
  key: z.string(),
  name: z.string(),
  system: z.string().optional(),
  posterURL: z.string().optional(),
  hidden: z.boolean(),
  avatarURL: z.string().optional(),
  flowTime: z.number(),
  homepage: z.string().optional(),
  description: z.string().optional(),
  owners: z.array(z.string()),
})

export type Site = z.infer<typeof SiteSchema>
