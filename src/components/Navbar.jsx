import useAuthStore from '../store/authStore.js';
import { FaHeart, FaUserCircle } from 'react-icons/fa';

export default function Navbar() {
  const { user, logout, toggleAuthModal, toggleProfileModal } = useAuthStore();

  const favoriteCount = user?.favorites?.length || 0;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-bg border-b border-border shadow-md">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-16">
        {/* Izquierda: Usuario / Perfil */}
        <div className="flex items-center gap-4">
          {user ? (
            <button onClick={toggleProfileModal} className="flex items-center gap-3">
              {user.imagen ? (
                <img
                  src={user.imagen}
                  alt="Perfil"
                  className="w-10 h-10 rounded-full object-cover border-2 border-neon-green shadow-glow-green cursor-pointer transition-transform hover:scale-110"
                />
              ) : (
                <FaUserCircle className="text-4xl text-neon-green cursor-pointer" />
              )}
              <div className="flex items-center gap-2">
                <span className="text-text hover:text-neon-green transition">Hola, {user.nombre || user.email.split('@')[0]}</span>
                <div className="relative">
                  <FaHeart className="text-red-400 text-xl" />
                  {favoriteCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-bg shadow-glow-red">
                      {favoriteCount}
                    </span>
                  )}
                </div>
              </div>
            </button>
          ) : (
            <button onClick={toggleAuthModal} className="flex items-center gap-2 text-text hover:text-neon-green transition">
              <FaUserCircle className="text-2xl" />
              Iniciar sesión
            </button>
          )}
        </div>

        {/* Centro: Logo */}
        <div className="flex items-center gap-3">
          <span className="text-3xl font-bold text-neon-pink tracking-wide">ERDE Store</span>
        </div>

        {/* Derecha: Links y Cerrar sesión */}
        <div className="flex items-center gap-8">
          <a href="#inicio" className="text-text hover:text-neon-green transition">Inicio</a>
          <a href="#productos" className="text-text hover:text-neon-green transition">Productos</a>
          <a href="#ofertas" className="text-text hover:text-neon-green transition">Ofertas</a>
          <a href="#contacto" className="text-text hover:text-neon-green transition">Contacto</a>

          {user && (
            <button onClick={logout} className="btn bg-neon-purple hover:bg-opacity-90 text-white px-6 py-2 rounded-lg transition">
              Cerrar sesión
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}