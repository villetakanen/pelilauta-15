import { ContentEntrySchema } from './Entry'
import { z } from 'zod'

export const ReplySchema = ContentEntrySchema.extend({
  quoteRef: z.string().optional(),
  threadKey: z.string(),
  lovers: z.array(z.string()).optional(),
  lovesCount: z.number().optional(),
})

export type Reply = z.infer<typeof ReplySchema>
