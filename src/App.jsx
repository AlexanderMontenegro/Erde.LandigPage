import { useEffect } from 'react';
import Navbar from './components/Navbar.jsx';
import Home from './pages/Home.jsx';
import useAuthStore from './store/authStore.js';
import './styles/theme.css';

export default function App() {
  const { initAuth } = useAuthStore();

  useEffect(() => {
    const unsubscribe = initAuth();
    return () => unsubscribe(); // Limpieza al desmontar
  }, [initAuth]);

  return (
    <div>
      <Navbar />
      <Home />
    </div>
  );
}