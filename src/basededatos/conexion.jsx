import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore"; // ✅

const firebaseConfig = {
  apiKey: "AIzaSyBoiiGykCIs33rYngB_YDEjCQfOEgHAZ7c",
  authDomain: "cinetribe-f19b9.firebaseapp.com",
  projectId: "cinetribe-f19b9",
  storageBucket: "cinetribe-f19b9.appspot.com",
  messagingSenderId: "397393446617",
  appId: "1:397393446617:web:500cf13f5597aff9b5e0c8",
  measurementId: "G-MQS3ME1RJX"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const storage = getStorage(app);
const db = getFirestore(app); // ✅

export { auth, storage, db };