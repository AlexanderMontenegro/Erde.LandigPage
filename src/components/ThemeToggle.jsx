import { useThemeStore } from "../store/themeStore";

export default function ThemeToggle() {
  const toggleTheme = useThemeStore((s) => s.toggleTheme);

  return (
    <button
      onClick={toggleTheme}
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        background: "#22d3ee",
        borderRadius: "50%",
        width: "50px",
        height: "50px",
      }}
    >
      🌙
    </button>
  );
}
