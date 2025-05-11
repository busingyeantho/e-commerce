// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// IMPORTANT: REPLACE WITH YOUR ACTUAL FIREBASE CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyCvaDgPuIxVqwcBdxmF8AKJu4eEBxoK-QY",
  authDomain: "e-commerce-9b8dc.firebaseapp.com",
  projectId: "e-commerce-9b8dc",
  storageBucket: "e-commerce-9b8dc.firebasestorage.app",
  messagingSenderId: "953900193708",
  appId: "1:953900193708:web:f82f88340373d0af764c09",
  measurementId: "G-LZKMP9QX00"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const realTimeDb = getDatabase(app);
const storage = getStorage(app);

export { auth, db, realTimeDb, storage, app };
