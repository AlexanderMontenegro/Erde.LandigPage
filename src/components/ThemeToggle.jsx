import { useThemeStore } from "../store/themeStore";

export default function ThemeToggle() {
  const toggleTheme = useThemeStore((s) => s.toggleTheme);

  return (
    <button onClick={toggleTheme} className="theme-toggle">
      🌙
    </button>
  );
}
