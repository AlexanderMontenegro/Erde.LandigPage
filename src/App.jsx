import { useState, useEffect } from 'react';
import Home from './pages/Home.jsx';
import Navbar from './components/Navbar.jsx';
import './styles/theme.css';

export default function App() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
    }
  }, [isDark]);

  return (
    <>
      <Navbar />
      
      {/* Toggle theme */}
      <button
        className="theme-toggle fixed top-4 right-20 z-50"
        onClick={() => setIsDark(!isDark)}
        aria-label="Cambiar tema oscuro/claro"
      />

      <Home />

      {/* Botón WhatsApp flotante */}
      <a
        href="https://wa.me/549TU_NUMERO?text=Hola%21%20Quiero%20consultar%20por%20un%20producto"
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-float"
      >
        <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12c0 2.14.7 4.11 1.88 5.71L2 22l4.29-1.88C7.89 21.3 9.86 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm.71 14.93c-1.48 0-2.92-.4-4.18-1.16l-.3-.18-3.12 1.37 1.37-3.12-.18-.3c-.76-1.26-1.16-2.7-1.16-4.18 0-4.14 3.36-7.5 7.5-7.5s7.5 3.36 7.5 7.5-3.36 7.5-7.5 7.5z"/>
        </svg>
      </a>
    </>
  );
}