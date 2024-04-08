// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "atg-rentals.firebaseapp.com",
  projectId: "atg-rentals",
  storageBucket: "atg-rentals.appspot.com",
  messagingSenderId: "489436313239",
  appId: "1:489436313239:web:78d4145d4830dfcc0f5bd2",
  measurementId: "G-8HS3C3FRST"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);