import { createSignal, type Component, onMount } from 'solid-js'
import type { Thread } from '@schemas/Thread'
import { marked } from 'marked'
import { topicToNoun } from '@schemas/conversions'
import { ProfileLink } from '@components/solid/profile/ProfileLink'
import { toLocaleString } from 'src/utils/toLocaleString'
import { useStore } from '@nanostores/solid'
import { $lovedEntries } from 'src/store/SessionStore'
import { ThreadLikeButton } from '@components/solid/threads/ThreadLikeButton'

function truncateHTML(rootElement: HTMLElement, maxLength = 277) {
  traverseAndTruncate(rootElement, maxLength)
  return rootElement.innerHTML
}

function truncateTextNode(node: Node, maxLength = 277) {
  if (node.nodeType === Node.TEXT_NODE) {
    let textContent = node.textContent || ''
    if (textContent.length > maxLength) {
      // Truncate the text content
      node.textContent = textContent.substring(0, maxLength) + '...'
    }
  }
}

function traverseAndTruncate(rootElement: Node, maxLength = 0) {
  let currentTextLength = 0
  const nodesToProcess = [rootElement] // Like a work queue

  while (nodesToProcess.length > 0) {
    const currentNode = nodesToProcess.pop() // Remove the last element
    if (!currentNode) continue
    if (currentNode.nodeType === Node.TEXT_NODE) {
      const textContent = currentNode.textContent || ''
      currentTextLength += textContent.length
      if (currentTextLength > maxLength) {
        truncateTextNode(
          currentNode,
          maxLength - (currentTextLength - textContent.length),
        )

        // Remove subsequent siblings
        let nextSibling = currentNode.nextSibling
        while (nextSibling) {
          if (!nextSibling.parentNode)
            throw new Error(
              "Node has no parent, this is an internal error in the browser's DOM implementation.",
            )
          nextSibling.parentNode.removeChild(nextSibling)
          nextSibling = currentNode.nextSibling
        }
        continue // Skip processing child nodes
      }
    } else if (currentNode.nodeType === Node.ELEMENT_NODE) {
      // Add child nodes in reverse (maintains depth-first order)
      const childNodes = Array.from(currentNode.childNodes)
      for (let i = childNodes.length - 1; i >= 0; i--) {
        nodesToProcess.push(childNodes[i])
      }
    }
  }
  // a bug in the current implementation adds an extra text-node "..." at the end of the rootElement
  rootElement.lastChild?.remove()
}

export const ThreadCard: Component<Thread> = (props) => {
  const [extract, setExtract] = createSignal('')
  const [coverImageUrl, setCoverImageUrl] = createSignal<string | undefined>(
    undefined,
  )

  onMount(async () => {
    const rawHTML = props.markdownContent
      ? await marked(props.markdownContent)
      : props.htmlContent

    const rootNode = new DOMParser().parseFromString(
      rawHTML || '',
      'text/html',
    ).body
    setExtract(truncateHTML(rootNode))

    if (props.youtubeId) {
      setCoverImageUrl(`https://img.youtube.com/vi/${props.youtubeId}/0.jpg`)
    } else if (props.images && props.images.length > 0) {
      setCoverImageUrl(props.images[0])
    }
  })

  return (
    <cn-card
      href={`/threads/${props.key}`}
      style="align-self: flex-start; width: 100%;"
      noun={topicToNoun(props.topic)}
      title={props.title}
      cover={coverImageUrl()}
    >
      <div class="small" innerHTML={extract()}></div>
      <div slot="actions">
        <div class="flex toolbar px-0">
          <p class="text-caption">
            <ProfileLink profileKey={props.owners[0]} />
          </p>
          <p class="text-caption">{toLocaleString(props.flowTime)}</p>
        </div>
        <div class="flex toolbar px-0">
          <ThreadLikeButton thread={props} />
          <a href={`/threads/${props.key}#discussion`}>
            <cn-reaction-button
              noun="discussion"
              count={props.replyCount || 0}
              style="pointer-actions:none"
            />
          </a>
        </div>
      </div>
    </cn-card>
  )
}
