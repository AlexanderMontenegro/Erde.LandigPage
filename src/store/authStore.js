import { create } from "zustand";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../config/firebase";

export const useAuthStore = create((set) => ({
  user: null,
  loading: true,

  initAuthListener: () => {
    onAuthStateChanged(auth, (user) => {
      set({ user, loading: false });
    });
  },

  logout: async () => {
    await signOut(auth);
    set({ user: null });
  },
}));
