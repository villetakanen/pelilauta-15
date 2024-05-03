/**
 * A Solidjs component that displays a list of SiteCard components.
 *
 * The component takes filter and order parameters to filter and order the list of sites.
 *
 * The component fetches the users own sites and the public sites from the firebase.
 */

import { createEffect, createSignal, type Component } from 'solid-js'
import type { Site } from '@schemas/Site'
import { SiteCard } from '../SiteCard'
import { FilterPanel } from '../../app/FilterPanel'
import { fetchSites } from './fetchSites'
import { removeDuplicates } from 'src/utils/entryUtils'
import type { Entry } from '@schemas/Entry'

export interface SiteCardProps {
  uid?: string
}

export const SiteCardList: Component<SiteCardProps> = (props) => {
  const [siteList, setSiteList] = createSignal(new Array<Site>())
  const [filter, setFilter] = createSignal('')
  const [order, setOrder] = createSignal('flowTime desc')

  createEffect(() => {
    getSites(0, 11, filter(), order(), props.uid)
  })

  async function getSites(
    offset = 0,
    limitTo = 11,
    filter = '',
    order = 'flowTime desc',
    uid = '',
  ) {
    const sites = await fetchSites(offset, limitTo, filter, order, uid)
    const newSiteList =[siteList(), ...sites]
    removeDuplicates(newSiteList as Entry[])
    setSiteList(newSiteList as Site[])
  }

  const filterOptions = {
    owner: 'Omistan',
    player: 'Pelaan',
    ll: 'Legendoja & lohikäärmeitä',
    dd: 'Dungeons & Dragons',
    hood: 'Hood',
    thequick: 'The Quick',
    homebrew: 'Homebrew',
    pbta: 'Powered by the Apocalypse',
    pelilauta: 'Pelilauta',
    myrrys: 'MYRRYS',
  }

  const sortOptions = {
    flowTime: 'Muokattu',
    name: 'Nimi',
  }

  return (
    <div class="CardList content-cards">
      <FilterPanel
        filterOptions={filterOptions}
        sortOptions={sortOptions}
        filter={[filter, setFilter]}
      />
      <div>
        {order()} - {filter()}
      </div>
      {siteList().map((site) => (
        filter() === '' || filter().split(';').includes(site.system || '-') ?
          <SiteCard site={site} /> : ''
      ))}
    </div>
  )
}
