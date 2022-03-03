import { db } from '../firebase'

const tbName = 'study_records'

export default {
  async getItem (parentId, id) {
    const docRef = db.collection('users').doc(parentId).collection(tbName).doc(id)
    const doc = await docRef.get()

    if (doc.exists) {
      return doc.data()
    } else {
      return null
    }
  },
  async getItems (parentId) {
    const docRef = db.collection('users').doc(parentId).collection(tbName)
    return await this.getFromDB(docRef)
  },
  async getFromDB (docRef) {
    const snapshot = await docRef.get()
    const items = await Promise.all(snapshot.docs.map((doc) => {
      const item = doc.data()
      // 個別の変換処理
      item.id = doc.id
      return item
    }))
    console.log(`get list: ${JSON.stringify(items)}`)
    return items
  },
}
