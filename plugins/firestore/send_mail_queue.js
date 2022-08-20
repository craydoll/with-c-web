import firebase from '@/plugins/firebase'
import 'firebase/firestore'
import MailContents from '@/plugins/firestore/mail_contents'

export default {
  async registerMail (obj) {
    console.log('in registerMail')
    const db = firebase.firestore()
    await db.collection('send_mail_queue').add(
      obj
    )
  },
  async sendMail (sendTo, name, contentsId) {
    try {
      // メール文面
      if (sendTo && name && contentsId) {
        const cont = await MailContents.getMailContents(contentsId)
        const str = cont.content.replace('[NAME]', name)

        // オブジェクトにする
        const obj = {
          content: str,
          subject: cont.subject,
          send_to: sendTo,
          req_date: new Date()
        }
        await this.registerMail(obj)
      }
    } catch (err) {
      throw new Error('sendMail:' + err)
    }
  }
}
