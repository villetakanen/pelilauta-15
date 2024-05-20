import { createSignal, type Component, onMount, For, onCleanup } from 'solid-js'
import { app } from '../../../../firebase/client'
import {
  QueryDocumentSnapshot,
  collection,
  getDocs,
  getFirestore,
  limit,
  onSnapshot,
  orderBy,
  query,
  startAfter,
  type DocumentData,
} from 'firebase/firestore'
import { extractFlowTime } from '@utils/extractFlowTime'
import { ThreadSchema, type Thread } from '@schemas/Thread'
import { ThreadCard } from './ThreadCard'
import { LoadingCard } from './LoadingCard'

/**
 * This is a Pelilauta live stream component. It subscribes to the 'steam' and displays
 * the latest 5 posts in the stream.
 *
 * Further posts will be auto-loaded as the user scrolls down.
 *
 * @returns The live stream component.
 */
export const LiveStream: Component = () => {
  const [posts, setPosts] = createSignal([] as Array<Thread>)

  let paginationRef: QueryDocumentSnapshot<DocumentData> | undefined = undefined

  onMount(async () => {
    const db = getFirestore(app)
    const postsQuery = query(
      collection(db, 'stream'),
      orderBy('flowTime', 'desc'),
      limit(5),
    )

    console.log('Subscribing to live stream...')

    // Subscribe to the query, and add the posts to the state
    const unsubscribe = onSnapshot(postsQuery, (snapshot) => {
      const newPosts: Array<Thread> = []
      snapshot.forEach((doc) => {
        console.log('Post:', doc.data())
        // if the post is already in the state, splice it
        const index = newPosts.findIndex((post) => post.key === doc.id)
        if (index !== -1) newPosts.splice(index, 1)
        newPosts.push(
          ThreadSchema.parse({
            ...doc.data(),
            key: doc.id,
            flowTime: extractFlowTime(doc.data()),
          }),
        )
        paginationRef = doc
      })

      onCleanup(() => unsubscribe())

      setPosts([...posts(), ...newPosts])
      console.log('Subscibed.')
    })
  })

  // When the load more button is visible, load more posts
  async function loadMore(event: Event) {
    event.preventDefault()
    if (paginationRef === undefined) return
    const db = getFirestore(app)
    const postsQuery = query(
      collection(db, 'stream'),
      orderBy('flowTime', 'desc'),
      limit(5),
      startAfter(paginationRef),
    )
    const newPosts = await getDocs(postsQuery)

    const newPostsData: Array<Thread> = []
    newPosts.forEach((doc) => {
      newPostsData.push(
        ThreadSchema.parse({
          ...doc.data(),
          key: doc.id,
          flowTime: extractFlowTime(doc.data()),
        }),
      )
      paginationRef = doc
    })

    setPosts([...posts(), ...newPostsData])
    console.log('Loaded more posts.')
  }

  return (
    <div>
      <section class="flex flex-column">
        <For each={posts()} fallback={<LoadingCard />}>
          {(post) => <ThreadCard {...post} />}
        </For>
      </section>
      <section class="flex">
        <button class="justify-self-center" onClick={loadMore}>
          Load more
        </button>
      </section>
    </div>
  )
}
