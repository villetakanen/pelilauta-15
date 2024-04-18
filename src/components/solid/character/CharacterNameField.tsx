import type { Component } from 'solid-js'
import { t } from 'src/utils/i18n'

export const CharacterSheetNameField: Component<{
  name: string
  characterId: string
}> = (props) => {
  function handleBlur(event: Event) {
    const newName = (event.target as HTMLInputElement).value
    fetch(`/api/characters/${props.characterId}`, {
      method: 'PATCH',
      body: JSON.stringify({ name: newName }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  return (
    <label>
      {t('entries:characters.name')}
      <input
        type="text"
        value={props.name}
        placeholder={t('entries:characters.namePlaceholder')}
        onBlur={handleBlur}
      />
    </label>
  )
}
