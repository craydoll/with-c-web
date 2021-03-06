import { db } from '../firebase'

const tbName = 'avatar'

export default {
  async getItem (id) {
    const docRef = db.collection(tbName).doc(id)
    const doc = await docRef.get()

    if (doc.exists) {
      return doc.data()
    } else {
      return null
    }
  },
  async getAllItems () {
    const docRef = db.collection(tbName).orderBy('order','asc')
    return await this.getFromDB(docRef)
  },
  async getItemsFirst4() {
    const docRef = db.collection(tbName).orderBy('order','asc').limit(4)
    return await this.getFromDB(docRef)
  },
  async getFromDB(docRef) {
    const snapshot = await docRef.get()
    const items = await Promise.all(snapshot.docs.map((doc) => {
      const item = doc.data()
      // 個別の変換処理
      item.id = doc.id
      return item
    }))
    return items
  },
  async save (docId, obj) {
    console.log(`in save ${JSON.stringify(obj)}`)
    if (docId === '') {
      console.log('docId is empty')
      const newDoc = await db.collection(tbName).add(obj)
      console.log('docId = ' + newDoc.id)
      return newDoc.id
    } else {
      console.log('docId exists')
      await db.collection(tbName).doc(docId).set(obj, { merge: true })
      return docId
    }
  },
  async delete (docId) {
    return await db.collection(tbName).doc(docId).delete()
  },
}
