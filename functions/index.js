/* eslint-disable max-len */
const functions = require("firebase-functions");
const admin = require("firebase-admin");
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

      // 学習時間の更新
      const subject = doc.subject;
      const studyTime = doc.end_date - doc.start_date;
      const totalRef = userRef.collection("total").doc(subject);
      const totalDoc = await totalRef.get();
      if (totalDoc.exists) {
        await totalRef.update({
          time: admin.firestore.FieldValue.increment(studyTime),
          point: admin.firestore.FieldValue.increment(givePoint),
        });
      } else {
        await totalRef.set({
          time: admin.firestore.FieldValue.increment(studyTime),
          point: admin.firestore.FieldValue.increment(givePoint),
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
