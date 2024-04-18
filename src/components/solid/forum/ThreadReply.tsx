import { useStore } from '@nanostores/solid'
import type { Reply } from '@schemas/Reply'
import type { Component } from 'solid-js'
import { $uid } from 'src/store/SessionStore'
import { ProfileLink } from '../profile/ProfileLink'

export const ThreadReply: Component<Reply> = (props) => {
  const uid = useStore($uid)

  return (
    <cn-bubble reply={props.owners.includes(uid())}>
      <div class="flex text-caption">
        <ProfileLink profileKey={props.owners[0]} />
      </div>
      <br />
      {props.markdownContent}
    </cn-bubble>
  )
}
