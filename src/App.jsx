import { useState, useEffect } from 'react';
import Home from './pages/Home.jsx';
import Navbar from './components/Navbar.jsx';
import './styles/theme.css';

export default function App() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  }, [isDark]);

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Botón toggle theme (puedes moverlo a Navbar si prefieres) */}
      <button
        className="theme-toggle fixed top-4 right-4 z-50"
        onClick={() => setIsDark(!isDark)}
        aria-label="Toggle dark/light mode"
      />

      <Home />
    </div>
  );
}