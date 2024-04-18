import { type Component } from 'solid-js'
import { z } from 'zod'
import { $uid, processLogin, processLogout } from '../../../store/SessionStore'
import { useStore } from '@nanostores/solid'
import { t } from 'src/utils/i18n'

const ProfileButtonPropsSchema = z.object({
  uid: z.string(),
})
type ProfileButtonProps = z.infer<typeof ProfileButtonPropsSchema>

export const ProfileButton: Component<ProfileButtonProps> = (props) => {
  // const $isActive = useStore(isActive)
  // const $isAuth = useStore(isAuth)
  const uid = useStore($uid)

  if (props.uid) processLogin(props.uid)
  else processLogout()

  return uid() ? (
    <a href={`/account`}>
      <cn-navigation-icon noun="avatar" label={t('navigation:profile')} />
    </a>
  ) : (
    <a href="/login">
      <cn-navigation-icon noun="login" label={t('navigation:login')} />
    </a>
  )
}
