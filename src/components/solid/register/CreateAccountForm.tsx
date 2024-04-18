import type { Component } from 'solid-js'
import { t } from 'src/utils/i18n'

export type CreateAccountFormProps = {
  uid: string
}

export const CreateAccountForm: Component<CreateAccountFormProps> = (props) => {
  async function onNicknameChange(event: Event) {
    const target = event.target as HTMLInputElement
    const nick = target.value
    // Check if nickname is already taken
    const checkResult = await fetch(`/api/nicks/${nick}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    if (checkResult.status === 200) {
      // Nickname is taken
      target.setCustomValidity(t('account:nicknameTaken'))
      target.reportValidity()
    } else {
      // Nickname is available
      target.setCustomValidity('')
      target.reportValidity()
    }
  }

  function onCancel() {
    console.log('Cancel')
    fetch(`/api/auth/signout`, {
      method: 'GET',
    }).then(() => {
      window.location.href = '/'
    })
  }

  function onSubmit(event: Event) {
    event.preventDefault()
    const form = event.target as HTMLFormElement
    const formData = new FormData(form)
    const nick = formData.get('nickname') as string

    // If nickname is already taken, don't submit
    if (form.checkValidity()) {
      return
    }

    fetch(`/api/account/${props.uid}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ eulaAccepted: true }),
    })

    fetch(`/api/profiles/${props.uid}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nick }),
    })
  }

  return (
    <form onsubmit={onSubmit}>
      <h3>{t('account:createAccountTitle')}</h3>
      <label>
        {t('account:nickLabel')}
        <input
          type="text"
          name="nickname"
          placeholder={t('account:nickPlaceholder')}
          onblur={onNicknameChange}
        />
      </label>
      <div class="flex">
        <div class="flex-grow" />
        <button onclick={onCancel}>{t('actions:cancel')}</button>
        <button class="call-to-action" type="submit">
          {t('account:createAccountAction')}
        </button>
      </div>
    </form>
  )
}
