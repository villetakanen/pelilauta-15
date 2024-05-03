/**
 * A button to like a thread
 */

import type { CyanReactionButton } from '@11thdeg/cyan-next'
import { useStore } from '@nanostores/solid'
import { ReactionSchema } from '@schemas/Reaction'
import type { Thread } from '@schemas/Thread'
import { createMemo, createSignal, type Component } from 'solid-js'
import { $lovedEntries, $uid } from 'src/store/SessionStore'

export const ThreadLikeButton: Component<{ thread: Thread }> = (props) => {
  const loved = useStore($lovedEntries)
  const uid = useStore($uid)

  const [lovedCount, setLovedCount] = createSignal(props.thread.lovedCount || 0)

  const disabled = createMemo(() => {
    if (!uid()) return true
    if (props.thread.owners.includes(uid())) return true
    return false
  })

  async function handleClick(e: Event) {
    const target = e.target as CyanReactionButton
    // Check if the user has already loved this thread
    if (target.checked) {
      const reaction = ReactionSchema.parse({
        actor: uid(),
        targetEntry: 'thread',
        targetActor: props.thread.key,
        type: 'unlove',
      })
      await fetch(`/api/reactions`, {
        method: 'POST',
        body: JSON.stringify(reaction),
      })
    } else {
      const reaction = ReactionSchema.parse({
        actor: uid(),
        targetEntry: 'thread',
        targetActor: props.thread.key,
        type: 'love',
      })
      await fetch(`/api/reactions`, {
        method: 'POST',
        body: JSON.stringify(reaction),
      })
    }
  }

  return (
    <cn-reaction-button
      disabled={disabled()}
      noun="love"
      onClick={handleClick}
      checked={loved().includes(props.thread.key) || undefined}
      count={lovedCount()}
    />
  )
}
