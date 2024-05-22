import * as z from 'zod'

export const AccountSchema = z.object({
  eulaAccepted: z.boolean(),
  lastLogin: z.date().optional(), // Timestamp, converted to Date
  lightMode: z.string().optional(), // dark or light
  uid: z.string(),
  updatedAt: z.date(), // Timestamp, converted to Date
  showAdminTools: z.string().optional(), // true or false, admin tools check admin privileges,
  // and this is used only for the UX of the App
})

export type Account = z.infer<typeof AccountSchema>

export function parseAccount(data: Record<string, any>, uid?: string): Account {

  if (!data) throw new Error('Can not parse account data from empty object')
  if (!data.uid && !uid) throw new Error('Can not parse account data without uid in either data or as a parameter')

  return AccountSchema.parse(
    {
      ...data,
      lastLogin: data.lastLogin ? new Date(data.lastLogin) : undefined,
      updatedAt: data.updatedAt ? new Date(data.updatedAt) : new Date(),
      uid: uid || data.uid,
      showadminTools: data.showAdminTools ? data.showAdminTools : 'false',
      eulaAccepted: data.eulaAccepted ? data.eulaAccepted : false
    }
  )
}