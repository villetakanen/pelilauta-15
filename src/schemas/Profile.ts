import { z } from 'zod'

export const ProfileSchema = z.object({
  key: z.string().optional(),
  nick: z.string(),
  avatarURL: z.string().optional(),
  bio: z.string().optional(),
  tags: z.array(z.string()).optional(),
})

export type Profile = z.infer<typeof ProfileSchema>

export function generateAvatarURL(p: Profile): string {
  // if (p.avatarURL) return p.avatarURL
  // Generate avatar SVG URL based on 2 first letters of nick
  const base64 = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="128" height="128">
      <circle cx=64" cy="64" r="64" fill="var(--cn-color-on-surface)"/>
      <text x="64" y="64" font-size="50" fill="var(--cn-color-surface)" text-anchor="middle" dominant-baseline="middle">${p.nick.slice(0, 2)}</text>
    </svg>`,
  ).toString('base64')
  return `data:image/svg+xml;base64,${base64}`
}
