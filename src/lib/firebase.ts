// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAhGKKa_dYF3OZIhR-iApaJTUV1ZarlOd4",
  authDomain: "shakomako-db93b.firebaseapp.com",
  projectId: "shakomako-db93b",
  storageBucket: "shakomako-db93b.firebasestorage.app",
  messagingSenderId: "379502363069",
  appId: "1:379502363069:web:9a2d069f5409be49fd52d4",
  measurementId: "G-RW0N9CY7BD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);

