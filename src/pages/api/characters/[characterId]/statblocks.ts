import type { APIRoute } from 'astro'
import { getFirestore } from 'firebase-admin/firestore'
import { z } from 'zod'
import type { StatBlock } from '@schemas/Character'
import { getSessionUser } from '../../../../firebase/server'

const AddStatBlockSchema = z.object({
  name: z.string(),
})

export const POST: APIRoute = async ({ params, request, cookies }) => {
  const characterId = params.characterId
  const db = getFirestore() // Get the Firestore instance
  const user = await getSessionUser(cookies) // Get the user's UID from the session cookie

  if (!characterId)
    return new Response('A characterId is required', { status: 400 })

  try {
    // Sanity
    const data = AddStatBlockSchema.parse(await request.json()) // Zod validation

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

    const characterData = characterDoc.data()
    const statBlocks: Array<StatBlock> = characterData?.statBlocks || [] // Default to an empty array if no stat blocks are present

    // Statblock names are unique, so check if the name already exists
    if (statBlocks.some((block) => block.name === data.name)) {
      return new Response('Stat block name already exists', { status: 400 })
    }

    // Add the new stat block
    statBlocks.push({
      name: data.name,
      attributes: {}, // Start with an empty attributes object
    })

    // Update in Firestore
    await charactersRef.doc(characterId).update({ statBlocks })
  } catch (error) {
    console.error(error)
    return new Response('Error adding stat block', { status: 500 })
  }

  return new Response('Added', { status: 200 })
}

export const DELETE: APIRoute = async ({ params, request, cookies }) => {
  const characterId = params.characterId
  const db = getFirestore() // Get the Firestore instance
  const user = await getSessionUser(cookies) // Get the user's UID from the session cookie
  if (!characterId)
    return new Response('A characterId is required', { status: 400 })
  try {
    const data = AddStatBlockSchema.parse(await request.json())

    // Fetch the character from firestore
    const charactersRef = db.collection('characters')
    const characterDoc = await charactersRef.doc(characterId).get()
    if (!characterDoc.exists) {
      console.log('Character not found')
      return new Response('Character not found', { status: 404 })
    }
    // Ensure the user owns the character
    if (user?.uid && characterDoc.data()?.owners?.indexOf(user.uid) === -1) {
      return new Response('Unauthorized', { status: 401 })
    }
    const characterData = characterDoc.data()
    const statBlocks: Array<StatBlock> = characterData?.statBlocks || [] // Default to an empty array if no stat blocks are present
    // Find the index of the stat block to delete
    const statBlockIndex = statBlocks.findIndex(
      (block) => block.name === data.name,
    )
    if (statBlockIndex === -1) {
      console.log('Stat block not found')
      return new Response('Stat block not found', { status: 404 })
    }
    // Remove the stat block from the array
    statBlocks.splice(statBlockIndex, 1)
    // Update in Firestore
    await charactersRef.doc(characterId).update({ statBlocks })
  } catch (error) {
    console.error(error)
    return new Response('Error deleting stat block', { status: 500 })
  }
  return new Response('Deleted', { status: 200 })
}
