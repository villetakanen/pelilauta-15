import { getSessionUser } from '@firebase/server'
import { ThreadSchema } from '@schemas/Thread'
import type { APIRoute } from 'astro'
import { FieldValue, type DocumentData } from 'firebase-admin/firestore'
import { logDebug } from 'src/utils/logHelpers'

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    // Get the params json as a ThreadSchema object
    const thread = ThreadSchema.parse(await request.json())

    // use the current user as an owner
    const { uid } = await getSessionUser(cookies)

    const threadData = thread as DocumentData

    delete threadData.key // Removing the key field from the thread data
    threadData.owners = [uid] // Overriding the owners array with the current user's uid
    threadData.createdAt = FieldValue.serverTimestamp() // Setting the createdAt field to the current server time
    threadData.updatedAt = FieldValue.serverTimestamp() // Setting the updatedAt field to the current server time
    threadData.flowTime = FieldValue.serverTimestamp() // Setting the flowTime field to the current server time
    threadData.public = true // Setting the public field to true
    threadData.sticky = threadData.sticky || false // Setting the sticky field to false if it's not already set

    /*const threadkey = await db.collection('stream').add(thread)*/

    logDebug('POST /api/threads', 'Saving thread', threadData)

    const threadDoc = {
      id: '123',
      data: threadData,
    }

    return new Response(
      JSON.stringify({ threadkey: threadDoc.id, ...threadDoc.data }),
      { status: 201 },
    )
  } catch (error: any) {
    return new Response((error as Error).message, { status: 400 })
  }
}
