// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC8ZSbkHS0lAM31Fn7ouXn76Sq5ZFjLm_U",
  authDomain: "vari-wordle.firebaseapp.com",
  projectId: "vari-wordle",
  storageBucket: "vari-wordle.appspot.com",
  messagingSenderId: "791385987040",
  appId: "1:791385987040:web:a9b8d983f3880b7b8a3d85",
  measurementId: "G-JSRZWXD509"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);