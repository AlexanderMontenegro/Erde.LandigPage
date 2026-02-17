// src/components/Navbar.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom'; // si usas rutas → sino quítalo y usa <a>
import { FiMenu, FiX, FiShoppingCart, FiUser } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';
import useAuthStore from '../store/authStore.js';

export default function Navbar() {
  const { 
    user, 
    logout, 
    toggleAuthModal, 
    toggleProfileModal 
  } = useAuthStore();

  const [menuOpen, setMenuOpen] = useState(false);
  const favoriteCount = user?.favorites?.length || 0;

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <div className="logo">
          <Link to="/" className="logo-text">
            ERDE <span className="logo-accent">Store</span>
          </Link>
        </div>

        {/* Menú desktop */}
        <div className="nav-links desktop">
          <a href="#inicio">Inicio</a>
          <a href="#productos">Productos</a>
          <a href="#ofertas">Ofertas</a>
          <a href="#contacto">Contacto</a>
        </div>

        {/* Barra de búsqueda (descomenta si la quieres) */}
        {/* <div className="search-container desktop">
          <input
            type="search"
            placeholder="Buscar productos..."
            className="search-input"
          />
        </div> */}

        {/* Acciones derecha */}
        <div className="nav-actions">
          

          {/* Usuario / Perfil */}
          {user ? (
            <div className="user-section">
              <button
                onClick={toggleProfileModal}
                className="profile-btn"
                aria-label="Ver perfil"
              >
                {user?.imagen ? (
                  <img
                    src={user.imagen}
                    alt="Perfil"
                    className="profile-img"
                  />
                ) : (
                  <FiUser size={24} className="profile-icon" />
                )}
                <span className="user-greeting desktop">
                  Hola, {user?.nombre || user?.email?.split('@')[0] || 'Usuario'}
                </span>
                <div className="favorites-badge">
                  <FaHeart className="heart-icon" />
                  <span className="badge">{favoriteCount}</span>
                </div>
              </button>

              <button onClick={logout} className="logout-btn desktop">
                Cerrar sesión
              </button>
            </div>
          ) : (
            <button onClick={toggleAuthModal} className="login-btn">
              Iniciar sesión
            </button>
          )}

          {/* Hamburguesa mobile */}
          <button className="hamburger mobile" onClick={toggleMenu} aria-label="Menú">
            {menuOpen ? <FiX size={26} /> : <FiMenu size={26} />}
          </button>
        </div>
      </div>

      {/* Menú mobile */}
      {menuOpen && (
        <div className="mobile-menu">
          <a href="#inicio" onClick={toggleMenu}>Inicio</a>
          <a href="#productos" onClick={toggleMenu}>Productos</a>
          <a href="#ofertas" onClick={toggleMenu}>Ofertas</a>
          <a href="#contacto" onClick={toggleMenu}>Contacto</a>

          {user ? (
            <>
              <button onClick={() => { toggleProfileModal(); toggleMenu(); }} className="mobile-item">
                Mi perfil
              </button>
              <button onClick={() => { logout(); toggleMenu(); }} className="mobile-item logout">
                Cerrar sesión
              </button>
            </>
          ) : (
            <button onClick={() => { toggleAuthModal(); toggleMenu(); }} className="mobile-item login">
              Iniciar sesión
            </button>
          )}
        </div>
      )}
    </nav>
  );
}