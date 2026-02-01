import { Link } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

export default function Navbar() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  return (
    <header className="w-full border-b bg-white shadow-sm">
      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold">
          Erde
        </Link>

        {/* Links */}
        <div className="flex items-center gap-4">
          <Link to="/" className="hover:underline">
            Inicio
          </Link>

          <Link to="/cart" className="hover:underline">
            Carrito
          </Link>

          {user ? (
            <button
              onClick={logout}
              className="px-4 py-2 rounded bg-black text-white"
            >
              Salir
            </button>
          ) : (
            <span className="text-sm text-gray-500">
              Invitado
            </span>
          )}
        </div>
      </nav>
    </header>
  );
}
