import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Navbar from "./components/layout/Navbar";
import AuthModal from "./components/auth/AuthModal";
import { useAuthStore } from "./store/authStore";

export default function App() {
  const user = useAuthStore((s) => s.user);
  const loading = useAuthStore((s) => s.loading);

  if (loading) {
    return <div className="p-10 text-center">Cargando...</div>;
  }

  return (
    <>
      <Navbar />
      {!user && <AuthModal />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
      </Routes>
    </>
  );
}
