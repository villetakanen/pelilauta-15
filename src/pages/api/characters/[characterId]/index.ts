import { getFirestore } from 'firebase-admin/firestore'
import { getSessionUser } from '../../../../firebase/server'
import type { APIRoute } from 'astro'
import { CharacterSchema } from '@schemas/Character'

export const PATCH: APIRoute = async ({ params, request, cookies }) => {
  const characterId = params.characterId
  const db = getFirestore() // Get the Firestore instance
  const user = await getSessionUser(cookies) // Get the user's UID from the session cookie

  // The data should be partial of a Zod schema CharacterSchema
  const data = await request.json()
  const character = CharacterSchema.partial().parse(data)

  console.log('Updating character', characterId, character)

  if (!characterId)
    return new Response('A characterId is required', { status: 400 })

  try {
    // Fetch the character from firestore
    const charactersRef = db.collection('characters')
    const characterDoc = await charactersRef.doc(characterId).get()

    if (!characterDoc.exists) {
      return new Response('Character not found', { status: 404 })
    }

    // Ensure the user owns the character
    if (user?.uid && characterDoc.data()?.owners?.indexOf(user.uid) === -1) {
      return new Response('Unauthorized', { status: 401 })
    }

    // Update in Firestore
    await charactersRef.doc(characterId).update(character)
  } catch (error) {
    console.error(error)
    return new Response('Error updating character', { status: 500 })
  }

  return new Response('Success', { status: 200 })
}
