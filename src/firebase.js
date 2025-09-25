// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";      // For authentication
import { getFirestore } from "firebase/firestore"; // ✅ Firestore

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBn3XrE2YRV8vXzrO_C0rs0h9kfJD3uVHQ",
  authDomain: "daily-growth-tracker.firebaseapp.com",
  projectId: "daily-growth-tracker",
  storageBucket: "daily-growth-tracker.firebasestorage.app",
  messagingSenderId: "978977201720",
  appId: "1:978977201720:web:c5809d728b6c6dd05c90cd",
  measurementId: "G-0W6RS97RBN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Exports
export const analytics = getAnalytics(app);
export const auth = getAuth(app);  
export const db = getFirestore(app);   // ✅ Firestore instance
export default app;
