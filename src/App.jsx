import { Routes, Route } from "react-router-dom";
import { useAuthStore } from "./store/authStore";

import Navbar from "./components/Navbar";
import Shop from "./pages/Shop";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import AuthModal from "./components/auth/AuthModal";

export default function App() {
  const user = useAuthStore((state) => state.user);
  const loading = useAuthStore((state) => state.loading);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <p>Cargando...</p>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      {!user && <AuthModal />}

      <Routes>
        <Route path="/" element={<Shop />} />
        {user && <Route path="/home" element={<Home />} />}
        {user && <Route path="/cart" element={<Cart />} />}
      </Routes>
    </>
  );
}
