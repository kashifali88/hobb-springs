// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "hobb-springs.firebaseapp.com",
  projectId: "hobb-springs",
  storageBucket: "hobb-springs.firebasestorage.app",
  messagingSenderId: "693251585848",
  appId: "1:693251585848:web:50e7fb9ec475677bad33cd"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);