import { FaGamepad, FaSun, FaMoon } from 'react-icons/fa';

export default function Navbar() {
  return (
    <nav className="bg-card border-b border-border sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3">
            <FaGamepad className="text-neon-green text-2xl" />
            <span className="text-xl font-bold text-neon-pink">ERDE Store</span>
          </div>

          <div className="flex items-center gap-6">
            <a href="#productos" className="text-text hover:text-neon-green transition">Productos</a>
            <a href="#promociones" className="text-text hover:text-neon-blue transition">Ofertas</a>
            <a href="#contacto" className="text-text hover:text-neon-purple transition">Contacto</a>
          </div>
        </div>
      </div>
    </nav>
  );
}