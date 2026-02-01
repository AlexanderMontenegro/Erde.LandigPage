import { create } from "zustand";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../config/firebase";

export const useAuthStore = create((set) => ({
  user: null,
  loading: true,

  initAuthListener: () => {
    onAuthStateChanged(auth, (user) => {
      set({
        user: user ?? null,
        loading: false,
      });
    });
  },

  logout: async () => {
    await auth.signOut();
    set({ user: null });
  },
}));
