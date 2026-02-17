import useAuthStore from '../store/authStore.js';
import { FaHeart } from 'react-icons/fa';

export default function Navbar() {
  const { user, logout, toggleAuthModal, toggleProfileModal } = useAuthStore();

  const favoriteCount = user?.favorites?.length || 0;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-bg border-b border-border shadow-md">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-16">
        <div className="flex items-center gap-3">
          <button onClick={toggleProfileModal} className="flex items-center gap-2">
            {user?.imagen && (
              <img
                src={user.imagen}
                alt="Perfil"
                className="w-10 h-10 rounded-full object-cover border-2 border-neon-pink shadow-glow-pink cursor-pointer"
              />
            )}
            <span className="text-text-muted hover:text-accent-pink transition">Hola, {user?.nombre || 'Usuario'}</span>
            <FaHeart className="text-red-400" />
            <span className="bg-accent-pink text-white text-xs rounded-full px-2 py-1">{favoriteCount}</span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-2xl font-bold text-neon-pink">ERDE Store</span>
        </div>

        <div className="flex items-center gap-8">
          <a href="#inicio" className="text-text hover:text-primary transition">Inicio</a>
          <a href="#productos" className="text-text hover:text-primary transition">Productos</a>
          <a href="#ofertas" className="text-text hover:text-primary transition">Ofertas</a>
          <a href="#contacto" className="text-text hover:text-primary transition">Contacto</a>

          {user ? (
            <button onClick={logout} className="btn btn-outline px-6 py-2">
              Cerrar sesión
            </button>
          ) : (
            <button onClick={toggleAuthModal} className="btn btn-outline px-6 py-2">
              Iniciar sesión
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}