import React, { useState, useEffect } from 'react';
import './styles/root.css';
import Header from './components/Header';
import Navbar from './components/Navbar';
import Nosotros from './components/Nosotros';
import Servicios from './components/Servicios';
import InstagramWidget from './components/InstagramWidget';
import Contacto from './components/Contacto';
import WhatsAppButton from './components/WhatsApp';

function App() {
  const [theme, setTheme] = useState('light');

  // Cargar tema guardado al inicio
  useEffect(() => {
    const savedTheme = localStorage.getItem('erde-theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  // Aplicar tema cuando cambia
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('erde-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="App">
      <Navbar toggleTheme={toggleTheme} currentTheme={theme} />
      <Header />
      <Nosotros />
      <Servicios />
      <InstagramWidget />
      <Contacto />
      <WhatsAppButton />
    </div>
  );
}

export default App;