import { locales } from '../locales'
import { logWarn } from './logHelpers'

export type TranslationKey = {
  [key: string]: string | TranslationKey
}

/**
 * Replaces all ${} placeholders in the given string with the given values
 */
function replacePlaceholders(
  s: string,
  params?: Record<string, string>,
): string {
  if (!params) {
    return s
  }
  let modifiedString = s
  for (const key in params) {
    modifiedString = modifiedString.replace(
      new RegExp(`\\\${${key}}`, 'g'),
      params[key],
    )
  }
  return modifiedString
}

/**
 * Returns the translation for the given key. If the key is not found,
 * it will return the key itself.
 *
 * @param key {string} The translation key in format 'namespace.key.key2.key3'
 * @returns the translation or the key itself if not found, any ${} placeholders are
 * replaced with the given values
 */
export function t(key: string, options?: any) {
  const [namespace, rest] = key.split(':')
  const locale = locales['fi']

  let obj = locale[namespace] as TranslationKey

  if (!obj) {
    logWarn(`Translation namespace not found for key: ${key}`)
    return key
  }

  // Split the key into parts and traverse the object
  const keys = rest.split('.')

  for (const k of keys) {
    if (obj[k]) {
      // If the key is found, return it
      obj = obj[k] as TranslationKey
      if (typeof obj === 'string') {
        return replacePlaceholders(obj, options)
      }
    }
  }
  logWarn(`Translation key not found: ${key}`)
  return key
}
