import firebase,{ db } from '../firebase'
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

      // ポイントが書き換えられたか
      const oldItem = await this.getItem(docId)
      if (!oldItem) {
        console.log('初登録')
        obj.point = 0
      } else if (obj.point !== oldItem.point) {
          // ポイント履歴に書き込む
          console.log('ポイント書き換え')
          await db.collection(tbName).doc(docId).collection("point_log").add({
            date: new Date(),
            summary: "ユーザー情報編集によるポイント書き換え",
            point: obj.point,
          });          
      }
      await db.collection(tbName).doc(docId).set(obj, { merge: true })
      return docId
    }
  },
  async delete (docId) {
    return await db.collection(tbName).doc(docId).delete()
  },
  async decPoint (docId, point) {
    await db.collection(tbName).doc(docId).update({
      point: firebase.firestore.FieldValue.increment(-point),
    })
    // ポイント履歴に書き込む
    await db.collection(tbName).doc(docId).collection("point_log").add({
      date: new Date(),
      summary: "商品引換によるポイント減少",
      point: -point,
    });
  },
  async incPoint (docId, point) {
    await db.collection(tbName).doc(docId).update({
      point: firebase.firestore.FieldValue.increment(point),
    })
    // ポイント履歴に書き込む
    await db.collection(tbName).doc(docId).collection("point_log").add({
      date: new Date(),
      summary: "商品引換取り消しによるポイント増加",
      point,
    });
  },
  async getTotalBySubject(id) {
    const totalRef = db.collection(tbName).doc(id).collection('total')
    const totalDocs = totalRef.get()

    const list = (await totalDocs).docs.map((doc) => {
      const item = doc.data()
      item.subject = doc.id
      item.subject_nm = item.name
      return item
    })
    return list
  },
}
