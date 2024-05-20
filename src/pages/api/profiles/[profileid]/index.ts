import { db } from '@firebase/server/server'
import { ProfileSchema } from '@schemas/Profile'
import type { APIRoute } from 'astro'

export const GET: APIRoute = async ({ params }) => {
  const profileId = params.profileid

  if (profileId) {
    const profileDoc = await db.collection('profiles').doc(profileId).get()

    if (!profileDoc.exists || !profileDoc.data()) {
      return new Response('Profile not found', { status: 404 })
    }

    if (profileDoc.data()?.deleted) {
      return new Response('Profile deleted', { status: 410 })
    }

    try {
      const data = profileDoc.data()
      if (data) {
        const profile = ProfileSchema.parse(data)
        return new Response(JSON.stringify(profile), { status: 200 })
      }
    } catch (error) {
      console.error(error)
      return new Response('Error fetching profile', { status: 500 })
    }
  }

  return new Response('A profileId is required', { status: 400 })
}
