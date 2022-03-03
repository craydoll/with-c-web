import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/analytics'
import 'firebase/firestore'
import 'firebase/functions'
// import { firebaseConfig } from '@/plugins/firebaseProd'
import { firebaseConfig } from '@/plugins/firebaseDev'

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig)
  firebase.analytics()
}
const db = firebase.firestore()

export const authProviders = {
  // 使うものだけ定義しておきましょう
  Email: firebase.auth.EmailAuthProvider.PROVIDER_ID,
  Google: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
}
export { db }
export default firebase
