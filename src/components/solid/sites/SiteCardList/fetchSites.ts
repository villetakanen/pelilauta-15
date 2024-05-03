import { db } from '@firebase/client'
import { extractFlowTime } from '@firebase/helpers'
import { type Site, SiteSchema } from '@schemas/Site'
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAt,
  where,
} from 'firebase/firestore'
import { logDebug } from 'src/utils/logHelpers'

export async function fetchSites(
  offset = 0,
  limitTo = 11,
  filter = '',
  order = 'flowTime desc',
  uid = '',
) {
  // Create query parameters from the function arguments
  const filterArray = filter.split(';')
  const orderDirection = order.includes('desc') ? 'desc' : 'asc'
  const orderField = order.split(' ')[0]

  logDebug('fetchSites', {
    offset,
    limitTo,
    filter,
    order,
    uid,
    filterArray,
    orderDirection,
    orderField,
  })
  // fetch public sites
  const q =
    filterArray.length > 1
      ? query(
          collection(db, 'sites'),
          where('hidden', '==', false),
          limit(limitTo),
          orderBy(orderField, orderDirection),
          startAt(offset),
          where('system', 'in', filterArray),
        )
      : query(
          collection(db, 'sites'),
          limit(limitTo),
          orderBy(orderField, orderDirection),
          // startAt(offset)
        )
  const docs = (await getDocs(q)).docs
  const siteList = new Array<Site>()
  docs.forEach((doc) => {
    const site = SiteSchema.parse({
      ...doc.data(),
      key: doc.id,
      flowTime: extractFlowTime(doc.data()),
    })
    siteList.push(site)
  })
  logDebug('fetchSites length', siteList.length)
  return siteList
}
