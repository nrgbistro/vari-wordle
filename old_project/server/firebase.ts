// Import the functions you need from the SDKs you need
import admin from "firebase-admin";
import * as dotenv from "dotenv";
dotenv.config();

// Initialize the service account
admin.initializeApp({
	credential: admin.credential.cert({
		projectId: process.env.FIREBASE_PROJECT_ID,
		clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
		privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
	}),
});

export const db = admin.firestore();
