import { useEffect } from 'react';
import Navbar from './components/Navbar.jsx';
import Home from './pages/Home.jsx';
import useAuthStore from './store/authStore.js';
import AuthModal from './components/AuthModal.jsx'; // Nuevo modal
import './styles/theme.css';

export default function App() {
  const { initAuth } = useAuthStore();

  useEffect(() => {
    const unsubscribe = initAuth();
    return () => unsubscribe();
  }, [initAuth]);

  return (
    <div>
      <Navbar />
      <Home />
      <AuthModal />
    </div>
  );
}