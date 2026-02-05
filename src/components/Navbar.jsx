import { FaGamepad } from 'react-icons/fa';

export default function Navbar() {
  return (
    <nav className="sticky top-0 bg-dark-bg p-4 flex justify-between items-center z-40 glow-border">
      <div className="flex items-center gap-2">
        <FaGamepad className="text-neon-green" size={24} />
        <h1 className="text-xl font-bold text-neon-pink">ERDE Store</h1>
      </div>
      <ul className="flex gap-6">
        <li><a href="#productos" className="hover:glow-hover">Productos</a></li>
        <li><a href="#quienes-somos" className="hover:glow-hover">Quiénes Somos</a></li>
        <li><a href="#contacto" className="hover:glow-hover">Contacto</a></li>
        <li><a href="#promociones" className="hover:glow-hover">Promociones</a></li>
      </ul>
    </nav>
  );
}