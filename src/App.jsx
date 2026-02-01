import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Cart from "./pages/Cart";
import Navbar from "./components/Navbar";
import AuthModal from "./components/auth/AuthModal";
import { useAuthStore } from "./store/authStore";
import { useEffect } from "react";

export default function App() {
  const initAuthListener = useAuthStore((s) => s.initAuthListener);
  const loading = useAuthStore((s) => s.loading);

  useEffect(() => {
    initAuthListener();
  }, []);

  if (loading) return null;

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/cart" element={<Cart />} />
      </Routes>

      <AuthModal />
    </>
  );
}
