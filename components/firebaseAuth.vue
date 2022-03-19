<template>
  <v-container>
  <div id="firebaseui-auth-container" />
  </v-container>
</template>

<script>
import firebase, { authProviders } from '~/plugins/firebase'

export default {
  props: {
    successUrl: {
      type: String,
      default: '/',
      required: true
    }
  },
  mounted () {
    setTimeout(async () => {
      const firebaseui = require('firebaseui-ja')
      require('firebaseui-ja/dist/firebaseui.css')
      await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
      const config = {
        signInOptions: [
          authProviders.Email,
          authProviders.Google
        ],
        callbacks: {
          signInSuccessWithAuthResult (authResult, redirectUrl) {
            return true
          }
        },
        signInSuccessUrl: this.successUrl,
        signInFlow: 'popup'
      }
      console.log('nextUrld:' + this.successUrl)
      const ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(firebase.auth())
      ui.start('#firebaseui-auth-container', config)
    }, 0)
  }
}
</script>
