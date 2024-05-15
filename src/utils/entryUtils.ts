import type { Entry } from '@schemas/Entry'

/**
 * Takes in an array of entris, and returns a new array with duplicates removed.
 *
 * The function should compare the entries based on the key field.
 *
 * If two entries have the same key, the function should keep the one with the largest flowTime.
 */
export function removeDuplicates(entries: Entry[]) {
  for (let i = 0; i < entries.length; i++) {
    for (let j = i + 1; j < entries.length; j++) {
      if (entries[i].key === entries[j].key) {
        if (entries[i].flowTime < entries[j].flowTime) {
          entries.splice(i, 1)
        } else {
          entries.splice(j, 1)
        }
      }
    }
  }
}
