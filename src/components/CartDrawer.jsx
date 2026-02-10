import useProductStore from '../store/productStore.js';

export default function CartDrawer() {
  const { cart, cartOpen, toggleCart, removeFromCart, updateQty, getTotalItems, getTotalPrice } = useProductStore();

  if (!cartOpen) return null;

  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();

  return (
    <>
      {/* Backdrop oscuro – clic fuera cierra */}
      <div
        className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm z-[99998]"
        onClick={toggleCart}
      />

      {/* Drawer desde derecha */}
      <div
        className={`fixed top-0 right-0 z-[99999] h-full w-full max-w-md bg-card shadow-left transform transition-transform duration-500 ease-out ${
          cartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-border flex items-center justify-between">
            <h2 className="text-2xl font-bold text-neon-green">
              Mi carrito ({totalItems})
            </h2>
            <button
              onClick={toggleCart}
              className="text-3xl text-text-muted hover:text-neon-pink transition"
            >
              ×
            </button>
          </div>

          {/* Lista de productos */}
          <div className="flex-1 p-6 overflow-y-auto space-y-6">
            {cart.length === 0 ? (
              <div className="text-center py-20 text-text-muted">
                <p className="text-xl">Tu carrito está vacío</p>
                <p className="mt-2">¡Agrega productos para continuar!</p>
              </div>
            ) : (
              cart.map(item => (
                <div key={item.id} className="flex gap-5 bg-dark-input p-5 rounded-xl">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-lg border border-border flex-shrink-0"
                    onError={e => e.target.src = 'https://via.placeholder.com/96?text=Sin+img'}
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-lg mb-1 line-clamp-2">{item.name}</h3>
                    <p className="text-neon-green font-bold mb-3">
                      ${item.basePrice.toLocaleString('es-AR')} × {item.qty}
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center bg-bg rounded-lg border border-border overflow-hidden">
                        <button
                          onClick={() => updateQty(item.id, -1)}
                          className="w-10 h-10 flex items-center justify-center text-xl hover:bg-card-hover transition"
                        >
                          −
                        </button>
                        <span className="w-12 text-center font-medium text-lg">{item.qty}</span>
                        <button
                          onClick={() => updateQty(item.id, 1)}
                          className="w-10 h-10 flex items-center justify-center text-xl hover:bg-card-hover transition"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="ml-auto text-red-400 hover:text-red-300 text-sm flex items-center gap-1"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-border mt-auto">
              <div className="flex justify-between text-xl font-bold mb-6">
                <span>Total:</span>
                <span className="text-neon-green">${totalPrice.toLocaleString('es-AR')}</span>
              </div>

              <button className="w-full bg-neon-purple hover:bg-opacity-90 py-5 text-xl font-bold rounded-xl transition shadow-glow-purple">
                Finalizar compra
              </button>

              <button
                onClick={toggleCart}
                className="w-full text-center text-text-muted hover:text-neon-blue mt-4 transition"
              >
                Seguir comprando →
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}