import { useStore } from '@nanostores/solid'
import { ThreadSchema, type Thread } from '@schemas/Thread'
import { createSignal } from 'solid-js'
import { $uid } from 'src/store/SessionStore'
import { entryContentAsMarkdown } from 'src/utils/entryContentAsMarkdown'
import { logDebug } from 'src/utils/logHelpers'
import EditorField from '../editor/EditorField'
import { ThreadEditorFormTopSecion } from './ThreadEditorFormTopSecion'

/**
 * This is a form for creating and editing threads.
 *
 * @param {Thread} thread - The thread to edit. If null or undefined, a new thread will be created.
 */
export default function ThreadEditorForm({ thread }: { thread?: Thread }) {
  const uid = useStore($uid)

  const [title, setTitle] = createSignal(thread?.title || '')
  const [markdownContent, setMarkdownContent] = createSignal(
    thread ? entryContentAsMarkdown(thread) : '...',
  )
  const [tags, setTags] = createSignal(thread?.tags?.join(', ') || '')
  const [searchable, setSearchable] = createSignal(thread?.public || false)
  const [sticky, setSticky] = createSignal(thread?.sticky || false)
  const [images, setImages] = createSignal(thread?.images?.join(', ') || '')
  const [owners] = createSignal(thread?.owners.join(', ') || uid())
  const [topic, setTopic] = createSignal(thread?.topic || '')

  function handleFormSubmit(e: Event) {
    e.preventDefault()
    const newThread = ThreadSchema.parse({
      key: thread?.key || '',
      title: title(),
      markdownContent: markdownContent(),
      tags: tags()
        .split(',')
        .map((t) => t.trim()),
      public: searchable(),
      sticky: sticky(),
      images: images()
        .split(',')
        .map((i) => i.trim()),
      owners: owners()
        .split(',')
        .map((o) => o.trim()),
      topic: topic(),
      flowTime: thread?.flowTime || 0,
    })
    logDebug('ThreadEditorForm', 'Saving thread', newThread)
    // Save the thread
    fetch('/api/threads', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newThread),
    })
      .then((res) => {
        if (res.ok) {
          logDebug('ThreadEditorForm', 'Thread saved successfully')
          // Open the thread '/threads/:key'
          window.location.href = `/threads/${newThread.key}`
        } else {
          logDebug('ThreadEditorForm', 'Failed to save thread', res)
        }
      })
      .catch((err) => {
        logDebug('ThreadEditorForm', 'Failed to save thread', err)
      })
  }

  return (
    <form onSubmit={handleFormSubmit}>
      <ThreadEditorFormTopSecion title={[title, setTitle]} />

      <EditorField
        content={[markdownContent, setMarkdownContent]}
        tags={[tags, setTags]}
      />
      <label>
        Tags:
        <input disabled type="text" value={tags()} />
      </label>
      <label>
        Searchable:
        <input
          type="checkbox"
          checked={searchable()}
          onChange={(e) => setSearchable(e.currentTarget.checked)}
        />
      </label>
      <label>
        Sticky:
        <input
          type="checkbox"
          checked={sticky()}
          onChange={(e) => setSticky(e.currentTarget.checked)}
        />
      </label>
      <label>
        Images:
        <input
          type="text"
          value={images()}
          onInput={(e) => setImages(e.currentTarget.value)}
        />
      </label>
      <label>
        Owners:
        <input type="text" value={owners()} disabled />
      </label>
      <label>
        Topic:
        <input
          type="text"
          value={topic()}
          onInput={(e) => setTopic(e.currentTarget.value)}
        />
      </label>
      <button type="submit">Save</button>
    </form>
  )
}
