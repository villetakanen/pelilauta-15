export function topicToNoun(topic: string | undefined): string {
  switch (topic) {
    case 'Roolipelit':
      return 'd20'
    case 'Yleinen':
      return 'discussion'
    case 'Videot':
      return 'youtube'
    default:
      return 'fox'
  }
}

export function systemToNoun(system: string | undefined): string {
  switch (system) {
    case 'll':
      return 'll-ampersand'
    case 'dd':
      return 'dd5'
    case 'mekanismi':
      return 'mekanismi'
    case 'hood':
      return 'hood'
    case 'quick':
      return 'thequick'
    case 'myrrys':
      return 'myrrys-scarlet'
    default:
      return 'homebrew'
  }
}

export function toDate(variable: any): Date {
  if (!variable) return new Date()
  if (variable instanceof Date) return variable
  if (typeof variable === 'string') return new Date(variable)
  if (typeof variable === 'number') return new Date(variable)
  if (variable?.seconds) return new Date(variable.seconds * 1000)
  return new Date()
}