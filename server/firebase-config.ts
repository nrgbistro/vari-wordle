// Import the functions you need from the SDKs you need
const { initializeApp } = require("firebase/app");
const { getFirestore } = require("firebase/firestore");
require("dotenv").config();

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: process.env.FIREBASE_API_KEY,
	authDomain: "vari-wordle.firebaseapp.com",
	projectId: "vari-wordle",
	storageBucket: "vari-wordle.appspot.com",
	messagingSenderId: "791385987040",
	appId: "1:791385987040:web:a9b8d983f3880b7b8a3d85",
	measurementId: "G-JSRZWXD509",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

module.exports = db;
