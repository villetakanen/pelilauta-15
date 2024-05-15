import type { Component } from 'solid-js'
import { t } from 'src/utils/i18n'
import { getAuth, sendSignInLinkToEmail } from "firebase/auth";
import { logError } from 'src/utils/logHelpers';

export const EmailLoginForm: Component = () => {

  const actionCodeSettings = {
    // URL you want to redirect back to. The domain (www.example.com) for this
    // URL must be in the authorized domains list in the Firebase Console.
    url: window.location.origin + '/login/email/confirm',
    // This must be true.
    handleCodeInApp: true,
    dynamicLinkDomain: window.location.origin
  };

  async function sendMagicLink(e: Event) {
    e.preventDefault()
    const auth = getAuth()
    const form = e.target as HTMLFormElement
    const email = form.email.value

    // check if email is valid before sending
    if (!email) {
      logError('Email is required, aborting')
      return
    }

    try {
      await sendSignInLinkToEmail(auth, email, actionCodeSettings)
      window.localStorage.setItem('emailForSignIn', email)
      alert(`Email sent to ${email}`)
    } catch (error) {
      logError(error)
    }
  }


  return (
    <section class="elevation-1 p-2 border-radius">
      <h3 class="downscaled">{t('app:login.withEmail.title')}</h3>
      <p>{t('app:login.withEmail.info')}</p>
      <form action="/api/login/email" method="post" onsubmit={sendMagicLink}>
        <input
          name="email"
          type="email"
          placeholder={t('app:login.withEmail.placeholder')}
          required
        />
        <div class="toolbar flex">
          <div></div>
          <button type="submit">{t('actions:submit')}</button>
        </div>
      </form>
    </section>
  )
}
