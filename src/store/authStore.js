import { create } from "zustand";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";

export const useAuthStore = create((set) => ({
  user: null,
  loading: true,

  showAuthModal: false,
  authMode: "login",

  openAuthModal: (mode = "login") =>
    set({ showAuthModal: true, authMode: mode }),

  closeAuthModal: () => set({ showAuthModal: false }),

  setAuthMode: (mode) => set({ authMode: mode }),

  initAuthListener: () => {
    onAuthStateChanged(auth, (user) => {
      set({ user, loading: false, showAuthModal: false });
    });
  },
}));
