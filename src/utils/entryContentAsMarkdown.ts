import type { ContentEntry } from '@schemas/Entry'
import TurndownService from 'turndown'

export function entryContentAsMarkdown(entry: ContentEntry): string {
  if (!entry.markdownContent) {
    const turndownService = new TurndownService()
    return turndownService.turndown(entry.htmlContent || '')
  }
  return entry.markdownContent || ''
}
