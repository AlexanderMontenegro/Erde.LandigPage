import useProductStore from '../store/productStore.js';

export default function CartDrawer() {
  const { cart, cartOpen, toggleCart, removeFromCart, updateQty, getTotalItems, getTotalPrice } = useProductStore();

  if (!cartOpen) return null;

  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-zinc-900 text-white shadow-2xl transform transition-transform duration-300 ease-in-out">
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b border-zinc-800">
        <h2 className="text-xl font-bold">Tu Carrito ({totalItems})</h2>
        <button 
          onClick={toggleCart}
          className="text-gray-400 hover:text-white text-2xl"
        >
          ×
        </button>
      </div>

      {/* Contenido */}
      <div className="p-5 overflow-y-auto h-[calc(100vh-180px)]">
        {cart.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            <p className="text-lg">Tu carrito está vacío</p>
            <p className="mt-2">¡Agrega algunos productos!</p>
          </div>
        ) : (
          <div className="space-y-5">
            {cart.map(item => (
              <div 
                key={item.id}
                className="flex gap-4 bg-zinc-800 p-4 rounded-lg"
              >
                {/* Miniatura */}
                <img 
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-md flex-shrink-0 bg-zinc-700"
                  onError={e => { e.target.src = 'https://via.placeholder.com/80?text=Sin+img'; }}
                />

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium line-clamp-2">{item.name}</h3>
                  <p className="text-green-400 font-bold mt-1">
                    ${item.basePrice.toLocaleString('es-AR')}
                  </p>

                  {/* Cantidad y eliminar */}
                  <div className="flex items-center gap-3 mt-2">
                    <button
                      onClick={() => updateQty(item.id, item.qty - 1)}
                      className="w-8 h-8 flex items-center justify-center bg-zinc-700 rounded hover:bg-zinc-600"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-medium">{item.qty}</span>
                    <button
                      onClick={() => updateQty(item.id, item.qty + 1)}
                      className="w-8 h-8 flex items-center justify-center bg-zinc-700 rounded hover:bg-zinc-600"
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

      {/* Footer con total y acción */}
      {cart.length > 0 && (
        <div className="p-5 border-t border-zinc-800">
          <div className="flex justify-between text-lg font-bold mb-4">
            <span>Total:</span>
            <span className="text-green-400">${totalPrice.toLocaleString('es-AR')}</span>
          </div>

          <button className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-lg font-bold transition-colors">
            Finalizar compra
          </button>
        </div>
      )}
    </div>
  );
}