import { db, getSessionUser } from '@firebase/server/server'
import { ProfileSchema, type Profile } from '@schemas/Profile'
import type { APIRoute } from 'astro'
import { logDebug } from 'src/utils/logHelpers'

export const GET: APIRoute = async ({ cookies }) => {
  const user = await getSessionUser(cookies)
  logDebug('GET /api/profiles', user, cookies)

  // Listing of profiles is only allowed for logged in users
  if (!user?.uid) {
    return new Response('Unauthorized', { status: 401 })
  }

  const allProfileDocs = await db.collection('profiles').get()
  const profiles: Record<string, Profile> = {}
  allProfileDocs.forEach((doc) => {
    const profile = ProfileSchema.parse(doc.data())
    profiles[doc.id] = profile
  })

  return new Response(JSON.stringify(profiles), {
    headers: {
      'content-type': 'application/json',
      'Vercel-CDN-Cache-Control': 'max-age=3600',
      'CDN-Cache-Control': 'max-age=60',
    },
  })
}
