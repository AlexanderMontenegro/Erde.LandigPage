import { create } from "zustand";
import { auth, db } from "../config/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

export const useAuthStore = create((set) => ({
  user: null,
  loading: true,

  register: async (email, password, data) => {
    const res = await createUserWithEmailAndPassword(auth, email, password);

    await setDoc(doc(db, "users", res.user.uid), {
      ...data,
      email,
      createdAt: new Date(),
    });

    set({ user: { uid: res.user.uid, email, ...data } });
  },

  login: async (email, password) => {
    const res = await signInWithEmailAndPassword(auth, email, password);
    const snap = await getDoc(doc(db, "users", res.user.uid));
    set({ user: { uid: res.user.uid, ...snap.data() } });
  },

  loginWithGoogle: async () => {
    const provider = new GoogleAuthProvider();
    const res = await signInWithPopup(auth, provider);

    const ref = doc(db, "users", res.user.uid);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      await setDoc(ref, {
        name: res.user.displayName,
        email: res.user.email,
        phone: "",
        address: "",
        createdAt: new Date(),
      });
    }

    set({ user: { uid: res.user.uid, ...snap.data() } });
  },

  logout: async () => {
    await signOut(auth);
    set({ user: null });
  },

  listenAuth: () => {
    onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        set({ user: null, loading: false });
        return;
      }

      const snap = await getDoc(doc(db, "users", firebaseUser.uid));
      set({ user: { uid: firebaseUser.uid, ...snap.data() }, loading: false });
    });
  },
}));
