import useProductStore from '../store/productStore.js';
import useAuthStore from '../store/authStore.js';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

export default function ProductCard({ product }) {
  const openModal = useProductStore(s => s.openModal);
  const { user, addFavorite, removeFavorite } = useAuthStore();

  const isFavorite = user?.favorites?.includes(product.id) || false;

  const handleFavorite = () => {
    if (!user) {
      return; 
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
      <div className="p-5 flex flex-col flex-1 fban">
        <h3 className="font-bold text-lg mb-2 line-clamp-2">{product.name}</h3>
        {/*<p className="price text-2xl font-extrabold mb-4">${product.basePrice.
        toLocaleString('es-AR')}</p>*/}

        <button onClick={() => openModal(product)} className="btn btn-primary mt-auto">
          Ver detalle
        </button>

        {user && (
          <button 
            onClick={handleFavorite} 
            className="btnfav favorite-btn"  
            aria-label={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
          >
            {isFavorite ? (
              <FaHeart size={28} className="text-red-500 animate-heart-pop" />
            ) : (
              <FaRegHeart size={28} className="text-red-400 hover:text-red-500 transition-colors" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}