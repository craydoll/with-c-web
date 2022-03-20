import firebase from '@/plugins/firebase'
import Users from '@/plugins/firestore/users'
export default function ({ route, store, redirect }) {
  console.log('in authenticated')
  return new Promise((resolve) => {
    try {
      firebase.auth().onAuthStateChanged(async (user) => {
        const query = route.query
        try {
          if (user) {
            const uid = user.uid
            console.log('login:' + uid)
            await store.dispatch('auth/loggedIn', uid)

            const userObj = await Users.getItem(uid)
            if (userObj) {
              console.log('ユーザー情報あり:'+ uid)
              await store.dispatch('auth/setUser', userObj)
            } else {
              // 新規登録（ユーザー登録は未実装）
              console.log('ユーザー情報未登録')
            }
          } else {
            console.log('未ログイン')
          }
          return resolve(user)
        } catch (err) {
          console.log('エラー:' + err)
          redirect('/login', Object.assign(query, { mes: err.message }))
        }
      })
    } catch (err) {
      console.log('Error in authenticated' + err)
      redirect('/login?mes=' + err.message)
    }
  })
}
