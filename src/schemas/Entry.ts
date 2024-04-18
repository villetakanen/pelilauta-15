import { z } from 'zod'

export const EntrySchema = z.object({
  key: z.string(),
  flowTime: z.number(),
})

export const ContentEntrySchema = EntrySchema.extend({
  public: z.boolean().optional(),
  sticky: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
  markdownContent: z.string().optional(),
  htmlContent: z.string().optional(),
  images: z.array(z.string()).optional(),
  owners: z.array(z.string()),
})

export type Entry = z.infer<typeof EntrySchema>

export type ContentEntry = z.infer<typeof ContentEntrySchema>
