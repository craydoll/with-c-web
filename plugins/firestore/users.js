import { db } from '../firebase'
import avatars from './avatars'

const tbName = 'users'

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
  async getFromDB (docRef) {
    const snapshot = await docRef.get()
    const items = await Promise.all(snapshot.docs.map(async (doc) => {
      const item = doc.data()
      // 個別の変換処理
      item.id = doc.id
      const avatar = await avatars.getItem(item.avatar)
      if (avatar) {
        item.img = avatar.img
      }
      const total = await this.getTotalBySubject(doc.id)
      item.total = total
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
  async getTotalBySubject(id) {
    const totalRef = db.collection(tbName).doc(id).collection('total')
    const totalDocs = totalRef.get()

    const list = (await totalDocs).docs.map((doc) => {
      const item = doc.data()
      item.subject = doc.id
      item.subject_nm = item.name
      console.log('item is ' + JSON.stringify(item))
      return item
    })
    return list
  },
}
