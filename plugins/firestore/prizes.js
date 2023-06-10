import firebase, { db } from '../firebase'
const { Timestamp } = firebase.firestore;

const tbName = 'prizes'

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
    const docRef = db.collection(tbName)
    return await this.getFromDB(docRef)
  },
  async getNotExpiredItems() {
    const today = new Date()
    const docRef = db.collection(tbName).where('expiration', '>', today).orderBy('expiration','desc').orderBy('reg_date','desc')
    const result = await this.getFromDB(docRef)
    return result.filter((item) => {
      return item.stock > 0
    })
  },
  async getFromDB (docRef) {
    const snapshot = await docRef.get()
    const items = await Promise.all(snapshot.docs.map((doc) => {
      const item = doc.data()
      console.log('in prize:' + JSON.stringify(item))
      // 個別の変換処理
      item.id = doc.id
      
      if (item.expiration instanceof Timestamp) {
        item.expiration = item.expiration.toDate()
      }
      
      item.reg_date = item.reg_date.toDate()
      return item
    }))
    return items
  },
  async save (docId, obj) {
    if (docId === '') {
      console.log('docId is empty')
      const newDoc = await db.collection(tbName).add(obj)
      console.log('docId = ' + newDoc.id)
      return newDoc.id
    } else {
      console.log('docId exists:' + docId)
      await db.collection(tbName).doc(docId).set(obj, { merge: true })
      return docId
    }
  },
  async delete (docId) {
    return await db.collection(tbName).doc(docId).delete()
  },
  async incStock(docId) {
    await db.collection(tbName).doc(docId).update({
      stock: firebase.firestore.FieldValue.increment(1),
    });
  },
  async decStock(docId) {
    await db.collection(tbName).doc(docId).update({
      stock: firebase.firestore.FieldValue.increment(-1),
    });
  },

}
