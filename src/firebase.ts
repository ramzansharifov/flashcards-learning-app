// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // если используешь Firestore

const firebaseConfig = {
  apiKey: "AIzaSyCrqkjbf3G72XMT5zahbSc4w2CQDDQ1ScQ",
  authDomain: "flashcards-learning-app-d6270.firebaseapp.com",
  projectId: "flashcards-learning-app-d6270",
  storageBucket: "flashcards-learning-app-d6270.firebasestorage.app",
  messagingSenderId: "1071481356924",
  appId: "1:1071481356924:web:c2b996c49bcc351ffe7ff9",
  measurementId: "G-P6EQMHKKVY",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app); // или getDatabase(app) для Realtime DB
