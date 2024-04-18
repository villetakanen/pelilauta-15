import { ThreadSchema } from '@schemas/Thread'
import type { APIRoute } from 'astro'
import { logDebug } from 'src/utils/logHelpers'

export const POST: APIRoute = async ({ request }) => {
  // Get the thread key from the URL
  //const { threadkey } = params

  // Get the thread data from the request body
  const body = await request.json()

  // Check if the request body is valid Thread data
  try {
    const thread = ThreadSchema.parse(body)

    logDebug('POST /api/threads', 'Saving thread', thread)
  } catch (error: any) {
    return new Response('Invalid thread data', { status: 400 })
  }

  // Finally, return error for failed requests
  return new Response('Failed to save thread', { status: 500 })
}
