import { ReplySchema, type Reply } from '@schemas/Reply'
import type { Thread } from '@schemas/Thread'
import { createSignal, type Component, onMount, onCleanup } from 'solid-js'
import { ThreadReply } from './ThreadReply'
import {
  collection,
  onSnapshot,
  type DocumentData,
} from 'firebase/firestore'
import { db } from '@firebase/client'
import { t } from 'src/utils/i18n'

export const ThreadDiscussion: Component<Thread> = (props) => {
  const [discussion, setDiscussion] = createSignal(new Array<Reply>())

  let unsubscribe = () => {}

  function parseReply(id: string, data: DocumentData): Reply {
    return ReplySchema.parse({
      ...data,
      key: id,
      threadKey: props.key,
      flowTime: data.flowTime.toMillis() + 1000,
    })
  }

  onCleanup(() => {
    unsubscribe()
  })

  onMount(async () => {
    unsubscribe = onSnapshot(
      collection(db, 'stream', props.key, 'comments'),
      async (snapshot) => {
        if (snapshot.empty) {
          return
        }
        const replies = [...discussion()]
        snapshot.docChanges().forEach((change) => {
          if (change.type === 'added') {
            replies.push(parseReply(change.doc.id, change.doc.data()))
          }
          if (change.type === 'modified') {
            const index = replies.findIndex(
              (reply) => reply.key === change.doc.id,
            )
            replies[index] = parseReply(change.doc.id, change.doc.data())
          }
          if (change.type === 'removed') {
            const index = replies.findIndex(
              (reply) => reply.key === change.doc.id,
            )
            replies.splice(index, 1)
          }
        })
        replies.sort((a, b) => a.flowTime - b.flowTime)
        setDiscussion(replies)
      },
    )
  })

  return (
    <div class="column-l flex flex-column">
      <h3 class="downscaled">{t('forum:ThreadDiscussionTitle')}</h3>
      {discussion().map((reply) => (
        <ThreadReply {...reply} />
      ))}
    </div>
  )
}
