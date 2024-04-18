import { z } from 'zod'

export const StatBlockSchema = z.object({
  name: z.string(),
  attributes: z.record(z.string()).optional(),
})

export type StatBlock = z.infer<typeof StatBlockSchema>

/**
 * A Player character for a role-playing game
 */
export const CharacterSchema = z.object({
  key: z.string(),
  name: z.string(),
  flowTime: z.number(),
  markdownContent: z.string().optional(),
  statBlocks: z.array(StatBlockSchema).optional(),
})

export type Character = z.infer<typeof CharacterSchema>
