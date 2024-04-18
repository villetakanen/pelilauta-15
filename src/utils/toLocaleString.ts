import { DateTime } from 'luxon'

export function toLocaleString(ts: Date | Number | undefined) {
  if (!ts) return '–'

  const dt =
    typeof ts === 'number'
      ? DateTime.fromMillis(ts)
      : DateTime.fromJSDate(ts as Date)

  return dt.toFormat('dd.MM.yyyy – HH:mm')
}
