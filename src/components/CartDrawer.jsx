// CartDrawer.jsx (mínimo)
import useProductStore from '../store/productStore.js';

export default function CartDrawer() {
  const { cart, cartOpen, toggleCart } = useProductStore();

  if (!cartOpen) return null;

  return (
    <div className="fixed right-0 top-0 h-full w-96 bg-gray-900 p-6 z-50 shadow-2xl">
      <button onClick={toggleCart} className="text-2xl mb-6">× Cerrar</button>
      <h2 className="text-2xl font-bold mb-6">Carrito</h2>
      {cart.length === 0 ? (
        <p>El carrito está vacío</p>
      ) : (
        cart.map(item => (
          <div key={item.id} className="mb-4 border-b pb-4">
            <p className="font-bold">{item.name}</p>
            <p>${item.basePrice}</p>
          </div>
        ))
      )}
    </div>
  );
}