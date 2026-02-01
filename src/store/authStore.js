import { create } from "zustand";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";

export const useAuthStore = create((set) => ({
  user: null,
  loading: true,

  // 🔐 Escucha el estado de autenticación
  listenAuth: () => {
    onAuthStateChanged(auth, (user) => {
      set({
        user,
        loading: false,
      });
    });
  },

  logout: async () => {
    await auth.signOut();
    set({ user: null });
  },
}));
