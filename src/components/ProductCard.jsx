import useProductStore from '../store/productStore.js';

export default function ProductCard({ product }) {
  const openModal = useProductStore(state => state.openModal);

  return (
    <div className="card glow cursor-pointer overflow-hidden group">
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      <div className="p-5">
        <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-neon-green transition-colors">
          {product.name}
        </h3>
        
        <p className="price text-2xl font-extrabold mb-4">
          ${product.basePrice.toLocaleString('es-AR')}
        </p>

        <button
          onClick={(e) => {
            e.stopPropagation(); // evita que el click en botón active el card entero si no querés
            openModal(product);
          }}
          className="btn btn-primary w-full text-base py-3"
        >
          Ver detalle
        </button>
      </div>
    </div>
  );
}