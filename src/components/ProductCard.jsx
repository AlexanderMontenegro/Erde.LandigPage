import useProductStore from '../store/productStore.js';
import useAuthStore from '../store/authStore.js';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

export default function ProductCard({ product }) {
  const openModal = useProductStore(s => s.openModal);
  const { user, addFavorite, removeFavorite } = useAuthStore();

  const isFavorite = user?.favorites?.includes(product.id) || false;

  const handleFavorite = () => {
    if (!user) {
      return; // No permite favoritos sin login
    }
    if (isFavorite) {
      removeFavorite(product.id);
    } else {
      addFavorite(product.id);
    }
  };

  return (
    <div className="card glow cursor-pointer">
      <img src={product.image} alt={product.name} className="card-img" />
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-bold text-lg mb-2 line-clamp-2">{product.name}</h3>
        <p className="price text-2xl font-extrabold mb-4">${product.basePrice.toLocaleString('es-AR')}</p>

        <button onClick={() => openModal(product)} className="btn btn-primary mt-auto">
          Ver detalle
        </button>

        {user && (
          <button onClick={handleFavorite} className="mt-2 text-red-400 hover:text-red-600">
            {isFavorite ? <FaHeart size={24} /> : <FaRegHeart size={24} />}
          </button>
        )}
      </div>
    </div>
  );
}