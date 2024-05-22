import type { APIRoute } from 'astro'
import { app, db } from '../../../firebase/server'
import { getAuth } from 'firebase-admin/auth'
import { parseAccount } from '@schemas/Account'
import { FieldValue } from 'firebase-admin/firestore'
import { logDebug } from '@utils/logHelpers'

export const GET: APIRoute = async ({ request, cookies, redirect }) => {
  const auth = getAuth(app)

  logDebug('GET /api/auth/signin', { cookies: request.headers.get('Authorization') })

  /* Get token from request headers */
  const idToken = request.headers.get('Authorization')?.split('Bearer ')[1]
  if (!idToken) {
    return new Response('No token found', { status: 401 })
  }

  let uid = ''
  /* Verify id token */
  try {
    uid = (await auth.verifyIdToken(idToken)).uid
  } catch (error) {
    return new Response('Invalid token', { status: 401 })
  }

  logDebug('GET /api/auth/signin with uid:', { uid })

  /* Create and set session cookie */
  const fiveDays = 60 * 60 * 24 * 5 * 1000
  const sessionCookie = await auth.createSessionCookie(idToken, {
    expiresIn: fiveDays,
  })

  cookies.set('session', sessionCookie, {
    path: '/',
  })

  // Get users account data
  const accountData = (await db.collection('account').doc(uid).get()).data()
  const account = parseAccount(accountData || {}, uid) // Parse account data, this will throw an error if the data is invalid or empty.

  // Check if the user has accepted the EULA
  if (!account.eulaAccepted) {
    return redirect('/eula')
  }

  // Add light mode to cookie
  if (account.lightMode) {
    cookies.set('lightMode', account.lightMode, {
      path: '/',
    })
  }

  // Add admin tools to cookie
  if (account.showAdminTools) {
    cookies.set('showAdminTools', account.showAdminTools, {
      path: '/',
    })
  }

  // Update last login time
  await db.collection('account').doc(uid).update({
    lastLogin: FieldValue.serverTimestamp(),
  })

  return redirect('/')
}
