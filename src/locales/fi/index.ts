import type { TranslationKey } from 'src/utils/i18n'
import { entries } from './entries'
import { actions } from './actions'
import { account } from './account'
import { profile } from './profile'
import { navigation } from './navigation'
import { sites } from './sites'

export const fi: TranslationKey = {
  app: {
    title: 'Pelilauta 2',
    loading: 'Ladataan...',
    login: {
      title: 'Kirjaudu sisään',
      info: 'Voit kirjautua palvelun käyttäjäksi käyttämällä sähköpostiosoitettasi, tai  Google-tiliäsi. Palvelu luo sinulle tunnuksen automaattisesti ensimmäisellä kirjautumiskerralla.',
    }
  },
  account,
  actions,
  entries,
  profile,
  sites,
  navigation,
}
