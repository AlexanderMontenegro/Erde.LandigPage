import useAuthStore from '../store/authStore.js';

export default function Navbar() {
  const { user, logout, toggleAuthModal, toggleProfileModal } = useAuthStore();

  const favoriteCount = user?.favorites?.length || 0;

  return (
    <nav className="navbar">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-16">
        <div className="flex items-center gap-3">
          <span className="text-2xl font-bold text-neon-pink">ERDE Store</span>
        </div>

        <div className="flex items-center gap-8">
          <a href="#inicio" className="text-text hover:text-primary transition">Inicio</a>
          <a href="#productos" className="text-text hover:text-primary transition">Productos</a>
          <a href="#ofertas" className="text-text hover:text-primary transition">Ofertas</a>
          <a href="#contacto" className="text-text hover:text-primary transition">Contacto</a>

          {user ? (
            <div className="flex items-center gap-4 relative">
              {user.imagen && (
                <div className="relative cursor-pointer" onClick={toggleProfileModal}>
                  <img
                    src={user.imagen}
                    alt="Perfil"
                    className="w-10 h-10 rounded-full object-cover border-2 border-neon-green shadow-glow-green"
                  />
                  {favoriteCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-accent-pink text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-bg">
                      {favoriteCount}
                    </span>
                  )}
                </div>
              )}
              <button onClick={toggleProfileModal} className="text-text-muted hover:text-primary transition">
                Hola, {user.nombre || user.email.split('@')[0]}
              </button>
              <button onClick={logout} className="btn btn-outline px-6 py-2">
                Cerrar sesión
              </button>
            </div>
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