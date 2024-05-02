import type { Site } from "@schemas/Site"
import { systemToNoun } from "@schemas/conversions"
import type { Component } from "solid-js"
import { LoveSiteButton } from "./LoveSiteButton"


export const SiteCard: Component<{ site: Site }>= (props) => {
  return (
    <cn-card
      title={props.site.name}
      href={`/sites/${props.site.key}`}
      cover={props.site.posterURL}
      noun={systemToNoun(props.site.system)}
    >
        <p class="small">
            {props.site.description}
        </p>
        <div slot="actions">
            <div class="flex toolbar px-0 site-list-item-meta">
            <p class="text-caption">{props.site.flowTime}</p>
            </div>
            <div class="flex toolbar px-0 site-list-item-reactions">
            <LoveSiteButton site={props.site} />
            </div>
        </div>
    </cn-card>
  )
}