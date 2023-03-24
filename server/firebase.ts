// Import the functions you need from the SDKs you need
const admin = require("firebase-admin");
const serviceAccount = require("./google-credentials.json");

// Initialize the service account
admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
module.exports = db;
