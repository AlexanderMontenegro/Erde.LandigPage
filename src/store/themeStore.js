import { create } from "zustand";

export const useThemeStore = create((set) => ({
  dark: false,

  toggleTheme: () =>
    set((state) => {
      const newMode = !state.dark;

      if (newMode) document.documentElement.classList.add("dark");
      else document.documentElement.classList.remove("dark");

      return { dark: newMode };
    }),
}));
