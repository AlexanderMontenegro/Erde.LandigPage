import { useEffect } from 'react';
import Navbar from './components/Navbar.jsx';
import Home from './pages/Home.jsx';
import AuthModal from './components/AuthModal.jsx';
import ProfileModal from './components/ProfileModal.jsx';
import ProductModal from './components/ProductModal.jsx';
import CartDrawer from './components/CartDrawer.jsx';
import FloatingCartButton from './components/FloatingCartButton.jsx';
import useAuthStore from './store/authStore.js';
import './styles/theme.css';

export default function App() {
  const { initAuth } = useAuthStore();

  useEffect(() => {
    const unsubscribe = initAuth();
    return () => unsubscribe();
  }, [initAuth]);

  return (
    <div className="relative min-h-screen bg-bg">
      <Navbar />
      <Home />

      {/* Emergentes – renderizados al final para prioridad */}
      <AuthModal />
      <ProfileModal />
      <ProductModal />
      <CartDrawer />
      <FloatingCartButton />
    </div>
  );
}