import useProductStore from '../store/productStore.js';

export default function CartDrawer() {
  const { cart, cartOpen, toggleCart, removeFromCart, updateQty, getTotalItems, getTotalPrice } = useProductStore();

  if (!cartOpen) return null;

  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-[9998]" onClick={toggleCart}>
      <div
        className="fixed top-0 right-0 h-full w-full max-w-md bg-dark-bg text-white shadow-left glow-border animate-slide-left"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-neon-green">Mi carrito ({totalItems})</h2>
            <button onClick={toggleCart} className="text-3xl text-gray-300 hover:text-white">✖</button>
          </div>

          {cart.length === 0 ? (
            <p className="text-center text-gray-400 py-10">Tu carrito está vacío</p>
          ) : (
            <div className="space-y-6">
              {cart.map(item => (
                <div key={item.id} className="flex gap-4 bg-dark-input p-4 rounded-lg">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded"
                    onError={e => e.target.src = 'https://via.placeholder.com/80?text=Sin+img'}
                  />
                  <div className="flex-1">
                    <h3 className="font-medium mb-1">{item.name}</h3>
                    <p className="text-neon-green font-bold mb-2">
                      ${item.basePrice.toLocaleString('es-AR')} c/u
                    </p>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateQty(item.id, -1)}
                        className="w-8 h-8 bg-border rounded flex items-center justify-center hover:bg-gray-700"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-bold">{item.qty}</span>
                      <button
                        onClick={() => updateQty(item.id, 1)}
                        className="w-8 h-8 bg-border rounded flex items-center justify-center hover:bg-gray-700"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="ml-auto text-red-400 hover:text-red-300 text-sm"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-6 border-t border-gray-700 mt-auto">
            <div className="flex justify-between text-lg font-bold mb-4">
              <span>Total:</span>
              <span className="text-neon-green">${totalPrice}</span>
            </div>
            <button className="w-full bg-neon-green text-black py-4 rounded-lg font-bold hover:bg-opacity-90 transition">
              Finalizar compra
            </button>
          </div>
        )}
      </div>
    </div>
  );
}