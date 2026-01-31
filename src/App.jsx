import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cart from "./pages/Cart";
import Navbar from "./components/Navbar";
import { useAuthStore } from "./store/authStore";

export default function App() {
  const user = useAuthStore((s) => s.user);
  const loading = useAuthStore((s) => s.loading);

  // 🔐 Esperamos a Firebase antes de renderizar rutas
  if (loading) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <p>Cargando...</p>
      </div>
    );
  }

  return (
    <>
      {user && <Navbar />}

      <Routes>
        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to="/" />}
        />

        <Route
          path="/register"
          element={!user ? <Register /> : <Navigate to="/" />}
        />

        <Route
          path="/"
          element={user ? <Home /> : <Navigate to="/login" />}
        />

        <Route
          path="/cart"
          element={user ? <Cart /> : <Navigate to="/login" />}
        />
      </Routes>
    </>
  );
}
