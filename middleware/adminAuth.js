import firebase from '@/plugins/firebase'
import Users from '@/plugins/firestore/users'
export default function ({ route, store, redirect }) {
  console.log('in adminAuth')
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
              if (!userObj.isAdmin) {
                console.log('管理者権限なし')
                const message = '管理者権限がありません'
                redirect('/errorPage?mes=' + message)
              }
            } else {
              const message='ユーザーが登録されていません'
              redirect('/errorPage?mes=' + message)
            }
          } else {
            const message='ログインしていません'
            redirect('/errorPage?mes=' + message)
          }
          return resolve(user)
        } catch (err) {
          console.log('エラー:' + err)
          redirect('/errorPage', Object.assign(query, { mes: err.message }))
        }
      })
    } catch (err) {
      console.log('Error in authenticated' + err)
      redirect('/errorPage?mes=' + err.message)
    }
  })
}
