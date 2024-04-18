import type { Component } from 'solid-js'
import type { Profile } from '@schemas/Profile'
import { t } from 'src/utils/i18n'

export const ProfileForm: Component<Profile> = (props) => {
  async function handleSubmit(event: Event) {
    event.preventDefault()
    // Check which fields have changed, and only send those
    const nick = (event.target as any).nick.value
    const bio = (event.target as any).bio.value
    const avatarURL = new URL((event.target as any).avatarURL.value).toString()
    const tags = (event.target as any).tags.value
      .split(',')
      .map((tag: string) => tag.trim())
    // Send the changes to the server
    const result = await fetch('/api/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nick, bio, tags, avatarURL }),
    })
    // If the server returns an error, show it to the user
    if (!result.ok) {
      const error = await result.json()
      alert(error.message)
      return
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div class="flex">
        <cn-avatar-button
          onclick={() => {
            alert('!')
          }}
          src={props.avatarURL || '/404'}
        ></cn-avatar-button>
        <div class="flex flex-col flex-grow">
          <label>
            {t('profile:nick')}
            <input id="nick" type="text" value={props.nick} />
          </label>
        </div>
      </div>
      <label>
        {t('profile:bio')}
        <textarea
          data-auto-expand
          placeholder={t('profile:bioPlaceholder')}
          id="bio"
          rows={5}
          maxLength={220}
          value={props.bio || ''}
        >
          {props.bio}
        </textarea>
      </label>
      <label>
        {t('profile:tags')}
        <input id="tags" type="text" value={props.tags?.join(', ')} />
      </label>
      <button type="submit">{t('actions:save')}</button>
    </form>
  )
}
