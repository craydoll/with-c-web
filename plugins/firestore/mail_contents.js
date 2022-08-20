import { db } from '../firebase'

export default {
  async getMailContents (id) {
    // 有効なIDかチェック
    const docMailContents = db.collection('mail_contents').doc(id)
    return await docMailContents.get()
      .then((doc) => {
        if (!doc.exists) {
          throw new Error('メールコンテンツ ' + id + ' は存在しません')
        } else {
          return doc.data()
        }
      })
  }
}
