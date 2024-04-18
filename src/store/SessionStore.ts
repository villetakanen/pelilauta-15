import { atom } from 'nanostores'
import { db } from '@firebase/client'
import { doc, getDoc } from 'firebase/firestore'
import { logDebug } from 'src/utils/logHelpers'

/**
 * Lots of the elements would like to know details of the
 * current session or user - but re-framing the same data is
 * costly and time-consuming. So, we use the login/logout-button
 * to update the session details and then use the same details
 * across the application.
 */

export const isActive = atom<boolean>(false)
export const isAuth = atom<boolean>(false)
export const $uid = atom<string>('')
/**
 * Keys to all entries that the user loves
 */
export const $lovedEntries = atom<string[]>([])

export async function processLogin(uid: string) {
  if ($uid.get() === uid) {
    logDebug(uid, 'Already logged in, aborting login process')
    return
  }
  $uid.set(uid)
  isActive.set(true)
  isAuth.set(true)
  await fetchLovedEntries(uid)
  logDebug(uid, 'Logged in')
}
export function processLogout() {
  $uid.set('')
  isActive.set(false)
  isAuth.set(false)
  $lovedEntries.set([])
}

async function fetchLovedEntries(uid: string) {
  const userRef = doc(db, 'profiles', uid)
  const userSnap = await getDoc(userRef)
  if (userSnap.exists()) {
    const data = userSnap.data()
    const loved = []
    if (data && data.lovedThreads) loved.push(...data.lovedThreads)
    if (data && data.lovedSites) loved.push(...data.lovedSites)
    $lovedEntries.set(loved)
  }
}
