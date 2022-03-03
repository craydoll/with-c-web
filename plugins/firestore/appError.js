import firebase from '@/plugins/firebase'
import 'firebase/firestore'

// エラーハンドリング戦略
// 画面でメッセージしてほしいものはApplicationError
// そのほか予期せぬエラーはError
// その場で解決できるものは各ファイルでハンドルするが
// 予期せぬエラーはVueで拾ってシステムエラー表示

// eslint-disable-next-line no-unused-vars
export class ApplicationError extends Error {
  constructor (message) {
    super(message)
    this.name = 'ApplicationError'
  }
}
export default {
  async sendError (id, error, place) {
    if (!id) {
      id = ''
    }
    if (!error.stack) {
      error.stack = ''
    }
    console.log(id, error, place)
    const db = firebase.firestore()
    await db.collection('app_error').add({
      id,
      time: new Date(),
      error: error.toString(),
      stack: error.stack,
      place
    })
  }
}
