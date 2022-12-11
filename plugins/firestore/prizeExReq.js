import { db } from '../firebase'

const tbName = 'prize_ex_req'

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
  async getItemsByPlace (placeId, incAccpt) {
    let docRef = db.collection(tbName).where('place_id', '==', placeId).orderBy('req_date','desc')
    if (incAccpt === false) {
      docRef = docRef.where('accepted','==',false)      
    }
    return await this.getFromDB(docRef)
  },
  async getFromDB(docRef) {
    const snapshot = await docRef.get()
    const items = await Promise.all(snapshot.docs.map((doc) => {
      const item = doc.data()
      console.log('item:' + JSON.stringify(item))
      // 個別の変換処理
      item.id = doc.id
      item.req_date = item.req_date.toDate()
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
  async create(user, prize) {
    const doc = {
      user_id: user.id,
      user_nm: user.name,
      req_date: new Date(),
      prize_id: prize.id,
      prize_nm: prize.name,
      prize_img: prize.img,
      place_id: prize.place_id,
      place_nm: prize.place,
      prize_pt: prize.point,
      accepted: false,
    }
    await this.save('', doc)
  },
  async accept(docId) {
    console.log('in accept:' + docId)
    await db.collection(tbName).doc(docId).set({
      accepted: true
    }, { merge: true })
    return docId
  },
  async cancel(docId) {
    console.log('in cancel:' + docId)
    await db.collection(tbName).doc(docId).set({
      accepted: false
    }, { merge: true })
    return docId
  },
  async reject(docId) {
    console.log('in reject:' + docId)
    const obj = await this.getItem(docId)
    console.log('obj:' + JSON.stringify(obj))

  },
}
