import { db, getSessionUser } from "@firebase/server";
import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request, cookies }) => {
  const { uid } = await getSessionUser(cookies);
  const reaction = await request.json();

  // If reaction author is not the same as the user, return 403
  if (reaction.actor !== uid || !uid) {
    return new Response('Forbidden', { status: 403 });
  }

  // Check if a reaction with the same actor, key and type already exists
  const existingReactions = await db.collection('profiles').doc(uid).collection('reactions')
    .where('actor', '==', reaction.actor)
    .where('targetActor', '==', reaction.targetActor)
    .where('type', '==', reaction.type).get();

  if (!existingReactions.empty) {
    // delete the existing reaction
    const existingReaction = existingReactions.docs[0];
    await existingReaction.ref.delete();
  }

  try {
    // Save the new reaction
    await db.collection('profiles').doc(uid).collection('reactions').add(reaction);
    return new Response('OK', { status: 200 });
  } catch (error: any) {
    return new Response((error as Error).message, { status: 400 });
  }
}