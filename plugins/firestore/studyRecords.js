import { db } from '../firebase'

const tbName = 'study_records'

export default {
  async getItem (parentId, id) {
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
      item.start_date = item.start_date ? item.start_date.toDate() : null
      item.end_date = item.end_date ? item.end_date.toDate() : null
      return item
    }))
    return items
  },
  async getAllItems () {
    const docRef = db.collectionGroup(tbName)
    return await this.getFromDB(docRef)
  },
  async save (parentId, docId, obj) {
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
  async getTotalBySubject(id) {
    const list = await this.getItems(id)
    console.log('num of study_records:' + list.length)    
    return [
      {
        subject: "国語",
        totalTime: 20,
        totalPoint: 12,
      },
      {
        subject: "算数",
        totalTime: 40,
        totalPoint: 22,
      },
      {
        subject: "英語",
        totalTime: 15,
        totalPoint: 5,
      },
      {
        subject: "社会",
        totalTime: 5,
        totalPoint: 5,
      },
      {
        subject: "理科",
        totalTime: 3,
        totalPoint: 2,
      },
  ]
  }
}
