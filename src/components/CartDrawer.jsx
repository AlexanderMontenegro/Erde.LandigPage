import useProductStore from '../store/productStore.js';
import useAuthStore from '../store/authStore.js';

export default function CartDrawer() {
  const { cart, cartOpen, toggleCart, removeFromCart, updateQty, getTotalItems, getTotalPrice } = useProductStore();
  const { user, toggleAuthModal } = useAuthStore();

  if (!cartOpen) return null;

  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();

  const handleCheckout = () => {
    if (!user) {
      toggleAuthModal(); // Abre modal de login si no está logueado
      return;
    }

    // Lógica temporal de prueba (reemplazar con Mercado Pago después)
    alert(`Procesando pago de $${totalPrice.toLocaleString('es-AR')} para ${totalItems} productos. ¡Gracias por tu compra!`);

    // Opcional: limpiar carrito después de "pago" simulado
    // clearCart(); // si agregas clearCart en productStore

    toggleCart(); // Cierra el drawer
  };

  return (
    <>
      {/* Backdrop – usa tu clase existente */}
      <div
        className="cart-drawer-backdrop"
        onClick={toggleCart}
      />

      {/* Drawer – usa tu clase existente + .open para slide */}
      <div className={`cart-drawer ${cartOpen ? 'open' : ''}`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="cart-header">
            <h2 className="cart-title">Mi carrito ({totalItems})</h2>
            <button className="cart-close-btn" onClick={toggleCart}>×</button>
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
                <div key={item.id} className="cart-item">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="cart-item-img"
                    onError={e => e.target.src = 'https://via.placeholder.com/96?text=Sin+img'}
                  />
                  <div className="cart-item-info">
                    <h3 className="cart-item-name">{item.name}</h3>
                    <p className="cart-item-price">
                      ${item.basePrice.toLocaleString('es-AR')} × {item.qty}
                    </p>
                    <div className="flex items-center gap-4 mt-2">
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

          {/* Footer – botón reparado con onClick */}
          {cart.length > 0 && (
            <div className="cart-footer">
              <div className="cart-total">
                <span>Total:</span>
                <span className="cart-total-price">${totalPrice.toLocaleString('es-AR')}</span>
              </div>
              <button onClick={handleCheckout} className="btn-checkout">
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