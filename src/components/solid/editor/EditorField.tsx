/**
 * This is a markdown editor field as a solidjs component.
 *
 * it takes in a signal of the markdown content and updates it when the user types.
 *
 * optionally, will update a signal for:
 * - youtube-link (string)
 * - image-links (string[])
 * - tags (string[])
 */
import { createEffect, type Signal } from 'solid-js'
import { logDebug } from 'src/utils/logHelpers'
import { t } from 'src/utils/i18n'

interface EditorFieldProps {
  content: Signal<string>
  youtubeLink?: Signal<string>
  imageLinks?: Signal<string[]>
  tags?: Signal<string>
}

export default function EditorField(props: EditorFieldProps) {
  const [content, setContent] = props.content

  function handleContentChange(e: Event) {
    const target = e.target as HTMLTextAreaElement
    setContent(target.value)
  }

  createEffect(() => {
    handleYoutubeLinkChange(content())
    handleTagsChange(content())
  })

  // Lazy check for youtube links
  async function handleYoutubeLinkChange(content: string) {
    const youtubeLinks = content.match(
      /https:\/\/www\.youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/,
    )
    if (youtubeLinks && youtubeLinks.length && props.youtubeLink) {
      logDebug('EditorField', 'Youtube link found', youtubeLinks[0])
      const [youtubeLink, setYoutubeLink] = props.youtubeLink
      if (youtubeLinks[0] === youtubeLink()) return
      setYoutubeLink(youtubeLinks[0])
    }
  }

  // Lazy check for hashtags
  async function handleTagsChange(content: string) {
    // Find all hashtags in the content, a hashtag is a word that starts with a # and ends with a space or newline
    const tags = content.match(/#[a-zA-Z0-9]+/g)
    if (tags && tags.length && props.tags) {
      logDebug('EditorField', 'Tags found', tags)
      const [tagsSignal, setTags] = props.tags
      const uniqueTags = Array.from(new Set(tags))
      logDebug('EditorField', 'Unique tags', uniqueTags, tagsSignal())
      setTags(uniqueTags.join(', '))
    }
  }

  return (
    <label class="flex-grow">
      {t('threads:fields.content')}
      <textarea
        onblur={handleContentChange}
        placeholder="Write your content here..."
      >
        {content()}
      </textarea>
    </label>
  )
}
