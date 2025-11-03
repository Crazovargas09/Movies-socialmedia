import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"; // ← asegúrate de tener esto

const firebaseConfig = {
  apiKey: "AIzaSyB0iiiyGK7VDEyJcQfOEgHAZ7C-",
  authDomain: "cinetribe-f19b9.firebaseapp.com",
  projectId: "cinetribe-f19b9",
  storageBucket: "cinetribe-f19b9.appspot.com",
  messagingSenderId: "300fcf3f3f3",
  appId: "1:300fcf3f3f3:web:50fcf3f3f3f3f3f3f3f3f3",
  measurementId: "G-MQ3SM2H1KZ"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app); // ← crea la instancia

export { auth }; // ← exporta para que Login.jsx y Signup.jsx puedan usarla