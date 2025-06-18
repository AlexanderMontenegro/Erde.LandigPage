import React from 'react';
import { Link as ScrollLink } from 'react-scroll'; // Cambio aquí: usar alias
import '../styles/Navbar.css';

const Navbar = ({ toggleTheme, currentTheme }) => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <span>ERDE</span> Diseño & Creación
        </div>
        
        <div className="navbar-links">
          <ScrollLink to="nosotros" smooth={true} duration={500}>Nosotros</ScrollLink>
          <ScrollLink to="servicios" smooth={true} duration={500}>Servicios</ScrollLink>
          <ScrollLink to="instagram" smooth={true} duration={500}>Galería</ScrollLink>
          <ScrollLink to="contacto" smooth={true} duration={500}>Contacto</ScrollLink>
          <a 
            href="https://www.mercadolibre.com.ar/perfil/ALEXANDERMONTENEGRO9106" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            Mercado Libre
          </a>
        </div>
        
        <button className="theme-toggle" onClick={toggleTheme}>
          {currentTheme === 'light' ? '🌙' : '☀️'}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;