import type { APIRoute } from 'astro'
import { app, db } from '../../../firebase/server'
import { getAuth } from 'firebase-admin/auth'
import { AccountSchema } from '@schemas/Account'
import { FieldValue } from 'firebase-admin/firestore'

export const GET: APIRoute = async ({ request, cookies, redirect }) => {
  const auth = getAuth(app)

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
  const account = AccountSchema.parse({
    ...accountData,
    uid,
    eulaAccepted: accountData?.eulaAccepted ?? false, // Legacy accounts may not have this field, default to false
    lastLogin: accountData?.lastLogin?.toDate(),
    updatedAt: accountData?.updatedAt.toDate(),
  })

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
