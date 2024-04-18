import type { Profile } from '@schemas/Profile'
import type { Component } from 'solid-js'
import { Show } from 'solid-js'

export const AvatarImage: Component<Profile> = (props) => {
  return (
    <div class="py-1">
      <Show when={props.avatarURL}>
        <img src={props.avatarURL} alt={props.nick} class="avatar" />
      </Show>
      <Show when={!props.avatarURL}>
        <div class="avatar elevation-1">
          <span class="placeholder">{props.nick.slice(0, 2)}</span>
        </div>
      </Show>
    </div>
  )
}
