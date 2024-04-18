import { z } from 'zod'
import { ContentEntrySchema } from './Entry'

export const ThreadSchema = ContentEntrySchema.extend({
  title: z.string(),
  topic: z.string().optional(),
  siteKey: z.string().optional(),
  youtubeId: z.string().optional(),
  topicKey: z.string().optional(), // key of the topic this thread belongs to, defaults to 'Yleinen'
  poster: z.string().optional(), // URL for the poster image
  images: z.array(z.string()).optional(), // URLs for the images shared as attachments
  replyCount: z.number().optional(),
  lovedCount: z.number().optional(),
  createdAt: z.any().optional(),
  updatedAt: z.any().optional(),
})

export type Thread = z.infer<typeof ThreadSchema>
