// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC_PiPw11YmAqdEPUi3lH1_kzAJohtWzjI",
  authDomain: "petanomalydetection.firebaseapp.com",
  databaseURL: "https://petanomalydetection-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "petanomalydetection",
  storageBucket: "petanomalydetection.firebasestorage.app",
  messagingSenderId: "877941952370",
  appId: "1:877941952370:web:f89e3e4e50ca6927f957eb",
  measurementId: "G-P8E9Q8YN02"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getDatabase(app);

export { auth, db };