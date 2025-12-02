import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  projectId: "kitchen-assistant-etud-2025",
  appId: "1:163560430470:web:fe2b1c519691a4d334aa07",
  storageBucket: "kitchen-assistant-etud-2025.firebasestorage.app",
  apiKey: "AIzaSyByZO77nishFdWPvBFhM0E37n0Hu_EWJwQ",
  authDomain: "kitchen-assistant-etud-2025.firebaseapp.com",
  messagingSenderId: "163560430470",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
