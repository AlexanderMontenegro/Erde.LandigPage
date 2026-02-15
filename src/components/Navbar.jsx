import useAuthStore from "../store/authStore.js";

export default function Navbar() {
  const { user, logout, toggleAuthModal, toggleProfileModal } = useAuthStore();

  const favoriteCount = user?.favorites?.length || 0;

  return (
    <nav className="navb ">
      <div>
        {/* Logo / Título */}
        <div>
          <span>ERDE</span>
          <span>Store</span>
        </div>

        {/* Links + Auth */}
        <div>
          {/* Links principales */}
          <div>
            <a href="#inicio">Inicio</a>
            <a href="#productos">Productos</a>
            <a href="#ofertas">Ofertas</a>
            <a href="#contacto">Contacto</a>
          </div>

          {/* Auth / Perfil */}
          {user ? (
            <div>
              {/* Imagen de perfil con marco neon */}
              {user.imagen && (
                <div onClick={toggleProfileModal}>
                  <div></div>
                  <img src={user.imagen} alt="Perfil" />
                  {favoriteCount > 0 && <span>{favoriteCount}</span>}
                </div>
              )}

              {/* Nombre + Logout */}
              <div>
                <button onClick={toggleProfileModal}>
                  Hola, {user.nombre || user.email.split("@")[0]}
                </button>
                <button onClick={logout}>Cerrar sesión</button>
              </div>
            </div>
          ) : (
            <button onClick={toggleAuthModal}>Iniciar sesión</button>
          )}
        </div>
      </div>
    </nav>
  );
}
