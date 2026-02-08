import useProductStore from '../store/productStore.js';
import { FaShoppingCart } from 'react-icons/fa';

export default function FloatingCartButton() {
  const { cart, toggleCart } = useProductStore();
  const count = cart.reduce((acc, item) => acc + item.qty, 0);

  return (
    <button onClick={toggleCart} className="fixed bottom-4 right-4 bg-neon-blue p-4 rounded-full glow-border hover:animate-pulse">
      <FaShoppingCart size={24} />
      {count > 0 && <span className="absolute top-0 right-0 bg-red-500 rounded-full px-2 text-xs">{count}</span>}
    </button>
  );
}