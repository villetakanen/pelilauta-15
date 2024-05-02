/**
 * A Solidjs component that displays a list of SiteCard components.
 * 
 * The component takes filter and order parameters to filter and order the list of sites.
 * 
 * The component fetches the users own sites and the public sites from the firebase.
 */

import { createSignal, onMount, type Component } from "solid-js";
import { db } from 'src/firebase/client'
import { collection, query, where, limit, orderBy, startAt, getDocs } from "firebase/firestore";
import { SiteSchema, type Site } from "@schemas/Site";
import { extractFlowTime } from "@firebase/helpers";
import { SiteCard } from "./SiteCard";
import { logDebug } from "src/utils/logHelpers";
import { FilterPanel } from "../app/FilterPanel";

export interface SiteCardProps {
  filter?: string;
  order?: string;
  uid?: string;
}

export const SiteCardList: Component<SiteCardProps> = (props) => {

    const [siteList, setSiteList] = createSignal(new Array<Site>())

    async function fetchSites(offset = 0, limitTo = 11, filter = '', order = 'flowTime desc', uid = '') {
      // fetch sites from firebase
      const filterArray = filter.split(';');


      const orderDirection = order.includes('desc') ? 'desc' : 'asc';
      const orderField = order.split(' ')[0];

      logDebug('fetchSites', { offset, limitTo, filter, order, uid, filterArray, orderDirection, orderField })

      // fetch public sites
      const q = filterArray.length > 1 ? query(
        collection(db, 'sites'),
        where('hidden', '==', false),
        limit(limitTo),
        //orderBy(orderField, orderDirection),
        //startAt(offset),
        //where('system', 'in', filterArray)
      ) :
        query(
          collection(db, 'sites'),
          limit(limitTo),
          //orderBy(orderField, orderDirection),
          //startAt(offset)
        );

      const docs = (await getDocs(q)).docs;

      logDebug('fetchSites got ', docs, 'docs')

      docs.forEach((doc) => {
        const site = SiteSchema.parse({
            ...doc.data(),
            key: doc.id,
            flowTime: extractFlowTime(doc.data()),
        })
        const sl = siteList();
        if (sl.find((s) => s.key === site.key)) sl.splice(sl.findIndex((s) => s.key === site.key), 1, site)
        sl.push(site)
        setSiteList(sl)
      })

      logDebug('fetchSites got ', siteList().length, 'sites')
    }

    onMount(() => {
      fetchSites(0, 11, props.filter, props.order, props.uid)
    })

    const filterOptions = {
        owner: 'Omistan',
        player: 'Pelaan',
        ll: "Legendoja & lohikäärmeitä",
        dd: "Dungeons & Dragons",
        hood: 'Hood',
        thequick: 'The Quick',
        homebrew: 'Homebrew',
        pbta: 'Powered by the Apocalypse',
        pelilauta: 'Pelilauta',
        myrrys: 'MYRRYS',
      }
      
      const sortOptions = {
        flowTime: "Muokattu",
        name: "Nimi",
      }


    return (
      <div class="CardList content-cards">
        <FilterPanel filterOptions={filterOptions} sortOptions={sortOptions} client:only="solid-js"/>
        {siteList().map((site) => (
          <SiteCard site={site} />
        ))}
      </div>
    )
}