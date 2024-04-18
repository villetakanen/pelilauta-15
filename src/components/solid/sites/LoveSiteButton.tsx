/**
 * A Solid wrapper for <cn-reaction-button> that shows the love button for a site
 *
 * uses Site as a prop, and checks if the site is loved by the user from the nanostore: $lovedEntries
 *
 * On a click, it will toggle the love status of the site in the nanostore, and submit the change to the server
 *
 * N.B. the lovedEntries store is populated at login, and cleared at logout - the love status is persisted
 * in the server for the user
 */

import { useStore } from '@nanostores/solid'
import type { Site } from '@schemas/Site'
import type { Component } from 'solid-js'
import { $lovedEntries, $uid } from 'src/store/SessionStore'

export const LoveSiteButton: Component<{ site: Site }> = (props) => {
  const loved = useStore($lovedEntries)
  const uid = useStore($uid)

  async function toggleLove() {
    const siteKey = props.site.key
    const lovedEntries = loved()
    if (lovedEntries.includes(siteKey)) {
      lovedEntries.splice(lovedEntries.indexOf(siteKey), 1)
      await fetch(`/api/reactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          key: siteKey,
          target: 'site',
          reaction: 'love',
          action: 'remove',
          actor: uid(),
        }),
      })
      $lovedEntries.set(lovedEntries)
    } else {
      lovedEntries.push(siteKey)
      await fetch(`/api/reactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          key: siteKey,
          target: 'site',
          reaction: 'love',
          action: 'add',
          actor: uid(),
        }),
      })
      $lovedEntries.set(lovedEntries)
    }
  }

  return (
    <cn-reaction-button
      noun="love"
      onClick={toggleLove}
      checked={loved().includes(props.site.key) || undefined}
    />
  )
}
