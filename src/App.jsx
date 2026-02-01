import { useState } from "react";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import AuthModal from "./components/AuthModal";
import { useAuthStore } from "./store/authStore";

export default function App() {
  const user = useAuthStore((s) => s.user);
  const loading = useAuthStore((s) => s.loading);
  const [authOpen, setAuthOpen] = useState(false);

  if (loading) return <p>Cargando...</p>;

  return (
    <>
      <button onClick={() => setAuthOpen(true)}>
        {user ? "Mi cuenta" : "Ingresar / Registrarse"}
      </button>

      <Home />
      {user && <Cart />}

      <AuthModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
      />
    </>
  );
}
