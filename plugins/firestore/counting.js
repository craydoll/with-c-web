import { db } from '../firebase'

const tbName = 'counting'

export default {
  async getItem(parentId, id) {
    const docRef = db.collection('users').doc(parentId).collection(tbName).doc(id)
    const doc = await docRef.get()

    if (doc.exists) {
      // 個別の変換処理
      const item = doc.data()
      item.record_date = item.record_date ? item.record_date.toDate() : null
      return item
    } else {
      return null
    }
  },
  async getItems(parentId) {
    const docRef = db.collection('users').doc(parentId).collection(tbName).orderBy('record_date','desc')
    return await this.getFromDB(docRef)
  },
  async getFromDB(docRef) {
    const snapshot = await docRef.get()
    const items = snapshot.docs.map((doc) => {
      const item = doc.data()
      // 個別の変換処理
      try {
        item.record_date = item.record_date ? item.record_date.toDate() : null
        return item
      } catch (err) {
        console.log('Err:' + err)
        return item
      }
    })
    return items
  },
  async getAllItems() {
    const docRef = db.collectionGroup(tbName)
    return await this.getFromDB(docRef)
  },
}
