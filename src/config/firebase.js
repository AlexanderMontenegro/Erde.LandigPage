import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyA2PZ2TK6wmbdyb5KXOqGNNMG73clMaEYg",
  authDomain: "erde-personalizados.firebaseapp.com",
  projectId: "erde-personalizados",
  storageBucket: "erde-personalizados.firebasestorage.app",
  messagingSenderId: "637143710056",
  appId: "1:637143710056:web:550a63e82d84e5f745fedd",
  measurementId: "G-Z1CQ8B4Z0P"
};

const app = getApps().length === 0
  ? initializeApp(firebaseConfig)
  : getApps()[0];

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
