import type { Component, Signal } from 'solid-js'
import { t } from 'src/utils/i18n'
import { SelectMediaButton } from '../media/SelectMediaButton'

export interface ThreadEditorFormTopSecionProps {
  title: Signal<string>
  selectImages?: () => void
}

export const ThreadEditorFormTopSecion: Component<
  ThreadEditorFormTopSecionProps
> = (props) => {
  const [title, setTitle] = props.title

  return (
    <section class="input-row">
      <label class="flex-grow">
        {t('entries:threads.title')}
        <input
          type="text"
          value={title()}
          onblur={(e) => setTitle(e.currentTarget.value)}
        />
      </label>
      <SelectMediaButton label={t('entries:threads.selectImages')} />
    </section>
  )
}
