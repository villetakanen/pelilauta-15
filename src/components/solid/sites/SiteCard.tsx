import type { Site } from '@schemas/Site'
import { systemToNoun } from '@schemas/conversions'
import type { Component } from 'solid-js'
import { LoveSiteButton } from './LoveSiteButton'
import { toLocaleString } from 'src/utils/toLocaleString'

export const SiteCard: Component<{ site: Site }> = (props) => {
  return (
    <cn-card
      title={props.site.name}
      href={`/sites/${props.site.key}`}
      cover={props.site.posterURL}
      noun={systemToNoun(props.site.system)}
    >
      <p class="small">{props.site.description}</p>
      <div class="toolbar flex px-0" slot="actions">
        <LoveSiteButton site={props.site} />
        <p class="text-caption">{toLocaleString(props.site.flowTime)}</p>
      </div>
    </cn-card>
  )
}
