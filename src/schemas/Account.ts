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
