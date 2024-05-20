import type { AstroCookies } from 'astro'
import { getAuth } from 'firebase-admin/auth'
import { app } from '.'

export async function getSessionUser(cookies: AstroCookies) {
  const auth = getAuth(app)
  if (cookies.has('session')) {
    const sessionCookie = cookies.get('session')?.value
    const decodedCookie = sessionCookie
      ? await auth.verifySessionCookie(sessionCookie)
      : false
    if (decodedCookie) {
      return {
        uid: decodedCookie.user_id,
        name: decodedCookie.name,
      }
    }
  }
  return { uid: '', name: '' }
}
