import { ContentEntrySchema } from './Entry'
import { z } from 'zod'

export const PageSchema = ContentEntrySchema.extend({
  name: z.string(),
  parentKey: z.string(),
})

export type Page = z.infer<typeof PageSchema>
