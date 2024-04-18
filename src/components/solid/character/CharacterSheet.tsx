import type { Component } from 'solid-js'
import type { Character } from '@schemas/Character'
import { t } from 'src/utils/i18n'
import { CharacterSheetNameField } from './CharacterNameField'

interface CharacterSheetProps {
  character: Character
  // Define your component props here
}

const CharacterSheet: Component<CharacterSheetProps> = (props) => {
  const handleSubmit = (event: Event) => {
    event.preventDefault()
    // Get the form data
    const formData = new FormData(event.target as HTMLFormElement)
    const name = formData.get('name') as string

    // Make the API request to post the stat block
    fetch(`/api/characters/${props.character.key}/statblocks`, {
      method: 'POST',
      body: JSON.stringify({ name }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      // Refresh the page
      .then(() => location.reload())
  }

  const handleDelete = (event: Event) => {
    event.preventDefault()
    // Get the form data
    const formData = new FormData(event.target as HTMLFormElement)
    const name = formData.get('name') as string

    console.debug('Deleting stat block', name)

    // Make the API request to delete the stat block
    fetch(`/api/characters/${props.character.key}/statblocks`, {
      method: 'DELETE',
      body: JSON.stringify({ name }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      // Refresh the page
      .then(() => location.reload())
  }

  // Add your component logic here

  return (
    <div class="column-l">
      <CharacterSheetNameField
        name={props.character.name}
        characterId={props.character.key}
      />

      <form
        action={`/api/characters/${props.character.key}/statblocks`}
        method="post"
        onSubmit={handleSubmit}
      >
        {' '}
        <fieldset>
          <input
            type="text"
            name="name"
            placeholder={t('stats:statBlockName')}
          />
          <button type="submit">{t('stats:addStatBlock')}</button>
        </fieldset>
      </form>

      <div class="flex">
        {/* Iterate through stat blocks */}
        {props.character.statBlocks &&
          props.character.statBlocks.map((statBlock) => (
            <div data-key={statBlock.name}>
              <h4>
                {t(`stats:${statBlock.name}`)}
                <form onSubmit={handleDelete}>
                  <input
                    type="hidden"
                    name="name"
                    value={statBlock.name}
                    hidden
                  />
                  <button type="submit">
                    <cn-icon noun="fox"></cn-icon>
                  </button>
                  <cn-card title=""></cn-card>
                </form>
              </h4>{' '}
              {/* Localized stat block title */}
              {/* Iterate through attributes in the block */}
              <ul>
                {statBlock.attributes &&
                  Object.entries(statBlock.attributes).map(
                    ([attrName, attrValue]) => (
                      <li data-key={attrName}>
                        <strong>{t(`stats:${attrName}`)}: </strong> {attrValue}{' '}
                        {/* Localized attribute */}
                      </li>
                    ),
                  )}
              </ul>
            </div>
          ))}
      </div>
    </div>
  )
}

export default CharacterSheet
