import { Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import { useAuthStore } from "../store/authStore";

export default function Navbar() {
  const logout = useAuthStore((s) => s.logout);

  return (
    <nav style={{ padding: "15px", display: "flex", justifyContent: "space-between" }}>
      <h2>ERDE</h2>
      <div>
        <Link to="/">Inicio</Link>{" "}
        <Link to="/cart">Carrito</Link>{" "}
        <button onClick={logout}>Salir</button>
      </div>
      <ThemeToggle />
    </nav>
  );
}
