import { z } from "zod"

/**
 * A Public collection of a users reactions
 */
export const FIRESTORE_PATH = '/profiles/{userId}/reactions/{reactionId}'

const reactionTargets = z.enum(['site', 'thread', 'reply'])
const reactionTypes = z.enum(['love', 'unlove', 'reply'])

export const ReactionSchema = z.object({
  actor: z.string(),
  targetEntry: reactionTargets,
  targetActor: z.string(),
  type: reactionTypes,
})

export type Reaction = z.infer<typeof ReactionSchema>