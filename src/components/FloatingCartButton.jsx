// FloatingCartButton.jsx
import useProductStore from '../store/productStore.js';
import { FaShoppingCart } from 'react-icons/fa';

export default function FloatingCartButton() {
  const { cart, toggleCart } = useProductStore();
  const count = cart.length;

  return (
    <button
      onClick={toggleCart}
      className="fixed bottom-6 right-6 bg-green-600 text-white p-5 rounded-full shadow-2xl hover:bg-green-700 transition z-50"
    >
      <FaShoppingCart size={28} />
      {count > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
          {count}
        </span>
      )}
    </button>
  );
}