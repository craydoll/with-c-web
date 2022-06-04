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
