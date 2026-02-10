import { Link } from 'react-router-dom';

export default function Navbar() {
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
          <Link to="/login" className="btn btn-outline px-6 py-2">
            Iniciar sesión
          </Link>
        </div>
      </div>
    </nav>
  );
}