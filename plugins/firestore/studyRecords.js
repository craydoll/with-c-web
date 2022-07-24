import { db } from '../firebase'
import Subjects from './subjects'

const tbName = 'study_records'

export default {
  async getItem(parentId, id) {
    const docRef = db.collection('users').doc(parentId).collection(tbName).doc(id)
    const doc = await docRef.get()

    if (doc.exists) {
      // 個別の変換処理
      const item = doc.data()
      item.id = doc.id
      item.start_date = item.start_date.toDate()
      item.end_date = item.end_date.toDate()
      return item
    } else {
      return null
    }
  },
  async getItems(parentId) {
    const docRef = db.collection('users').doc(parentId).collection(tbName).orderBy('start_date','desc')
    return await this.getFromDB(docRef)
  },
  async getFromDB(docRef) {
    const snapshot = await docRef.get()
    const items = await Promise.all(snapshot.docs.map(async (doc) => {
      const item = doc.data()
      // 個別の変換処理
      item.id = doc.id
      item.start_date = item.start_date ? item.start_date.toDate() : null
      item.end_date = item.end_date ? item.end_date.toDate() : null
      const subject = await Subjects.getItem(item.subject)
      item.subject_nm = subject.name
      return item
    }))
    return items
  },
  async getAllItems() {
    const docRef = db.collectionGroup(tbName)
    return await this.getFromDB(docRef)
  },
  async save(parentId, docId, obj) {
    console.log(`in save ${JSON.stringify(obj)}`)
    if (docId === '') {
      console.log('docId is empty')
      const newDoc = await db.collection('users').doc(parentId).collection(tbName).add(obj)
      console.log('docId = ' + newDoc.id)
      return newDoc.id
    } else {
      console.log('docId exists')
      await db.collection('users').doc(parentId).collection(tbName).doc(docId).set(obj, { merge: true })
      return docId
    }
  },
  async getAverage() {
    const list = await this.getAllItems()
    const sum = list.reduce((acc, cur) => {
      if (cur.point) {
        return acc + cur.point
      } else {
        return acc
      }
    }, 0)
    if (list.length) {
      return Math.round(sum / list.length)
    } else {
      return 0
    }
  },
}
