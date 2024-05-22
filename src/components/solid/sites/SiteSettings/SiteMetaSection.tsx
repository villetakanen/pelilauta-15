import type { Site } from "@schemas/Site";
import { t } from "@utils/i18n";
import { createSignal, type Component } from "solid-js";

export const SiteMetaSection: Component<{ site: Site }> = (props) => {

  const [name, setName] = createSignal(props.site.name)
  const [description, setDescription] = createSignal(props.site.description)
  const [system, setSystem] = createSignal(props.site.system)

  function handleReset() {
    setName(props.site.name)
    setDescription(props.site.description)
    setSystem(props.site.system)
  }

  return (
    <section>
      <h3>{t('site:settings.meta.title')}</h3>
      <fieldset>
        <legend>{t('site:settings.meta.fieldset.title')}</legend>
        <label>
          <span>{t('entries:site.name')}</span>
          <input type="text" value={name()} />
        </label>
        <label>
          <span>{t('entries:site.description')}</span>
          <textarea>{description()}</textarea>
        </label>
        <label>
          <span>{t('entries:site.system')}</span>
          <input type="text" value={system()} />
        </label>
      </fieldset>
      <div class="toolbar flex">
        <div class="flex-grow"></div>
        <button type="reset"
            onClick={handleReset}
        >{t('actions:reset')}</button>
        <button type="submit">{t('actions:submit')}</button>
      </div>
    </section>
  )
}