import useProductStore from '../store/productStore.js';

export default function ProductCard({ product }) {
  const openModal = useProductStore(state => state.openModal);

  return (
    <div
      onClick={() => openModal(product)}
      className="bg-gray-900 rounded-xl overflow-hidden shadow-lg cursor-pointer hover:shadow-2xl hover:shadow-green-500/30 transition-all duration-300 border border-gray-800"
    >
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-56 object-cover"
        onError={e => { e.target.src = 'https://via.placeholder.com/300?text=Imagen+No+Disponible'; }}
      />
      <div className="p-5">
        <h3 className="text-xl font-bold mb-2">{product.name}</h3>
        <p className="text-gray-400 mb-3 line-clamp-2">{product.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold text-green-400">
            ${product.basePrice.toLocaleString('es-AR')}
          </span>
          {product.stock > 0 ? (
            <span className="text-sm text-green-500">Stock: {product.stock}</span>
          ) : (
            <span className="text-sm text-red-500">Agotado</span>
          )}
        </div>
      </div>
    </div>
  );
}