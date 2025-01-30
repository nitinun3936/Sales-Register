import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA4sT9ZeIMbf8kgq-pITTPRb5i3gic5fvE",
  authDomain: "fir-16cce.firebaseapp.com",
  projectId: "fir-16cce",
  storageBucket: "fir-16cce.firebasestorage.app",
  messagingSenderId: "1088094916683",
  appId: "1:1088094916683:web:00591723b65e9ac6c43dce",
  measurementId: "G-PZP91HS954",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore and Authentication
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
