import { createSignal, onMount, type Component } from 'solid-js'
import {
  getAuth,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
} from 'firebase/auth'
import { app } from 'src/firebase/client'
import { logDebug, logError } from 'src/utils/logHelpers'
import { t } from 'src/utils/i18n'

export const EmailLoginForm: Component = () => {
  const [email, setEmail] = createSignal('')
  const [sent, setSent] = createSignal(false)
  const auth = getAuth(app)
  const actionCodeSettings = {
    url: window.location.href,
    handleCodeInApp: true,
  }

  onMount(() => {
    // Check for email link on initial load
    if (isSignInWithEmailLink(auth, window.location.href)) {
      verifyLink() // Your verification logic
    }
  })

  const sendLink = async (e: Event) => {
    e.preventDefault()
    try {
      logDebug('Sending sign-in link to email:', email())
      logDebug('Action code settings:', actionCodeSettings)
      window.localStorage.setItem('emailForSignIn', email())
      await sendSignInLinkToEmail(auth, email(), actionCodeSettings)
      // Inform the user to check their email
      setSent(true)
    } catch (error) {
      // Handle errors (e.g., invalid email)
      logError(error)
    }
  }

  // In your /verify component
  const verifyLink = async () => {
    try {
      let email = window.localStorage.getItem('emailForSignIn')
      if (!email) {
        logError('No email found in local storage - aborting verification.')
        return
      }

      const userCredential = await signInWithEmailLink(
        auth,
        email,
        window.location.href,
      )
      const idToken = await userCredential.user.getIdToken()

      // Send ID Token to Server
      const response = await fetch('/api/auth/signin', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      })

      if (!response.ok) {
        throw new Error('Server login failed') // Or handle the error differently
      }

      // Clear email from storage.
      window.localStorage.removeItem('emailForSignIn')

      // Handle success (e.g., redirect to the dashboard)
      window.location.href = '/'
    } catch (error) {
      logError(error)
    }
  }

  return (
    <section class="elevation-1 border-radius p-2">
      {!sent() && (
        <form onSubmit={sendLink}>
          <input
            type="email"
            placeholder={t('app:login.withEmail.placeholder')}
            value={email()}
            onInput={(e) => setEmail(e.target.value)}
          />
          <button type="submit">{t('actions:submit')}</button>
        </form>
      )}
      {sent() && <p>{t('app:login.withEmail.sent')}</p>}
    </section>
  )
}
