import type { ServiceAccount } from 'firebase-admin'
import admin from 'firebase-admin'
import { initializeApp, cert } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import type { AstroCookies } from 'astro'
import { getFirestore } from 'firebase-admin/firestore'

const serviceAccount = {
  type: 'service_account',
  project_id: import.meta.env.FIREBASE_PROJECT_ID,
  private_key_id: import.meta.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: import.meta.env.FIREBASE_PRIVATE_KEY,
  client_email: import.meta.env.FIREBASE_CLIENT_EMAIL,
  client_id: import.meta.env.FIREBASE_CLIENT_ID,
  auth_uri: import.meta.env.FIREBASE_AUTH_URI,
  token_uri: import.meta.env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: import.meta.env.FIREBASE_AUTH_CERT_URL,
  client_x509_cert_url: import.meta.env.FIREBASE_CLIENT_CERT_URL,
}

let firebaseApp

if (!admin.apps.length) {
  initializeApp({
    credential: cert(serviceAccount as ServiceAccount),
  })
} else {
  firebaseApp = admin.app() // Reuse existing instance
}

export const app = firebaseApp
export const db = getFirestore()

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
