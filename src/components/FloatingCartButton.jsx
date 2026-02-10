import useProductStore from '../store/productStore.js';
import { FaShoppingCart } from 'react-icons/fa';

export default function FloatingCartButton() {
  const { cart, toggleCart } = useProductStore();
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <button
      onClick={toggleCart}
      className="cart-float"
    >
      <FaShoppingCart />
      {totalItems > 0 && (
        <span className="cart-count">{totalItems}</span>
      )}
    </button>
  );
}