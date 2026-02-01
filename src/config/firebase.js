import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_AUTH_DOMAIN",
  projectId: "TU_PROJECT_ID",
  storageBucket: "TU_STORAGE_BUCKET",
  messagingSenderId: "TU_SENDER_ID",
  appId: "TU_APP_ID",
};

// 🔐 Evita inicialización duplicada
const app =
  getApps().length === 0
    ? initializeApp(firebaseConfig)
    : getApps()[0];

// 🔑 Auth
export const auth = getAuth(app);

// 🗄️ Firestore (PRODUCTOS / SERVICIOS)
export const db = getFirestore(app);
