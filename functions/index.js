/* eslint-disable max-len */
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const {getStorage} = require("firebase-admin/storage");
const nodemailer = require("nodemailer");
const mailAccount = "app@ishintai.org";
const adminMailAddress = "app@ishintai.org";
admin.initializeApp();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
exports.sampleDetector = functions.region("asia-northeast1")
    .https.onRequest(async (request, response) => {
      console.log("start sampleDetector:" + JSON.stringify(request.query));
      const uid = request.query.id;
      // CORS用にAccess-Control-Allow系ヘッダを追加
      response.set("Access-Control-Allow-Origin", "*");
      response.set("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS, POST");
      response.set("Access-Control-Allow-Headers", "*");

      return response.send("filepath is '/image/" + uid + "'");
    });
exports.calcPoint = functions.region("asia-northeast1")
    .firestore.document("/users/{userId}/study_records/{recId}")
    .onCreate(async (snap, context) => {
      // 挿入されたレコードから必要な内容をとってくる
      console.log("start calcPoint");
      const doc = snap.data();
      const givePoint = doc.point;

      const db = admin.firestore();
      const id = snap.ref.parent.parent.id;
      const userRef = db.collection("users").doc(id);

      // 教科名称をセット
      const subjectRef = db.collection("subjects").doc(doc.subject);
      const subject = (await subjectRef.get()).data();
      let subjectNm = "";
      if (subject) {
        subjectNm = subject.name;
      }

      // 学習時間の更新
      const studyTime = doc.end_date - doc.start_date;
      const totalRef = userRef.collection("total").doc(doc.subject);
      const totalDoc = await totalRef.get();
      if (totalDoc.exists) {
        await totalRef.update({
          time: admin.firestore.FieldValue.increment(studyTime),
          point: admin.firestore.FieldValue.increment(givePoint),
          name: subjectNm,
        });
      } else {
        await totalRef.set({
          time: admin.firestore.FieldValue.increment(studyTime),
          point: admin.firestore.FieldValue.increment(givePoint),
          name: subjectNm,
        });
      }
      // 合計ポイントの更新
      await userRef.update({
        point: admin.firestore.FieldValue.increment(givePoint),
      });
      await userRef.collection("point_log").add({
        date: new Date(),
        summary: "学習によるポイント付与",
        point: givePoint,
      });
    });

//  ********** メール送信処理 ****************
// Using smtp(SSL)
const auth = {
  type: "OAuth2",
  user: mailAccount,
  clientId: "887085898261-a2k5ehgu8envkhbit9973lr7okpergtu.apps.googleusercontent.com",
  clientSecret: "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",
  refreshToken: "1//04kGTHSDbHNbzCgYIARAAGAQSNgF-L9Iro4vsVhH7927IG_6zS-nECAp7yydSppJigksyz5wbLwaBeOwviJC_aEUYQgilaUT9hw",
};

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: auth,
});

// Sending the request
exports.sendMail = functions
    .region("asia-northeast1")
    .firestore.document("send_mail_queue/{docId}")
    .onCreate(async (snap, context) => {
    // 挿入されたレコードから必要な内容をとってくる
      const doc = snap.data();

      const to = doc.send_to;
      const subject = doc.subject;
      const content = doc.content;
      let cc = "";
      if (doc.cc) {
        cc = doc.cc;
      }
      const mailOptions = {
        from: adminMailAddress,
        to: to,
        cc: cc,
        subject: subject,
        html: content,
      };
      console.log("before sendmail", to, subject);

      try {
        const res = await transporter.sendMail(mailOptions);
        console.log("after sendmail:" + JSON.stringify(res));
        const procTime = new Date();
        return snap.ref.update({
          proc_time: procTime,
          status: "済",
        });
      } catch (e) {
        console.error("エラー: " + e);
        return snap.ref.update({error: e.toString()});
      }
    });

exports.deleteImg = functions
    .region("asia-northeast1")
    .runWith({
      // Ensure the function has enough memory and time
      // to process large files
      timeoutSeconds: 300,
      memory: "2GB",
    })
    .pubsub.schedule("0 1 * * *")
    .timeZone("Asia/Tokyo")
    .onRun(async (context) => {
      const storageRef = getStorage().ref();
      // Create a reference to the file to delete
      const delRef = storageRef.child("image/");
      // フォルダ配下のアイテムをすべて取得
      delRef.listAll().then((res) => {
        res.items.forEach((itemRef) => {
          // 削除
          console.log("delete:" + itemRef.name);
          itemRef.delete();
        });
      });
    });
