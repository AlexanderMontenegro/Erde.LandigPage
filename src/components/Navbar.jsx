import useAuthStore from '../store/authStore.js';

export default function Navbar() {
  const { user, logout, toggleAuthModal, toggleProfileModal } = useAuthStore();

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
            <div className="flex items-center gap-4">
              {user.imagen && (
                <img
                  src={user.imagen}
                  alt="Perfil"
                  className="u w-10 h-10 rounded-full object-cover border-2 border-neon-green cursor-pointer"
                  onClick={toggleProfileModal}
                />
              )}
              <button onClick={toggleProfileModal} className="text-text-muted hover:text-primary">
                Hola, {user.nombre || user.email}
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