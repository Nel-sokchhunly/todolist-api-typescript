const admin = require("firebase-admin");

var serviceAccount = require("/home/chunnly/College/Internship/self-learning/firebase-document/todo-list-application.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

// getting the database object

export const db = admin.firestore();
