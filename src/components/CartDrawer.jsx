import { useState } from 'react';
import useProductStore from '../store/productStore.js';
import useAuthStore from '../store/authStore.js';
import { createPreference } from '../api/mpService.js';

export default function CartDrawer() {
  const { cart, cartOpen, toggleCart, removeFromCart, updateQty, getTotalItems, getTotalPrice, clearCart } = useProductStore();
  const { user, toggleAuthModal } = useAuthStore();
  const [loading, setLoading] = useState(false);

  if (!cartOpen) return null;

  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();

  const handleCheckout = async () => {
    if (!user) {
      toggleAuthModal();
      return;
    }

    setLoading(true);
    try {
      const checkoutUrl = await createPreference(cart, user);
      window.location.href = checkoutUrl; // Redirige a Mercado Pago
    } catch (err) {
      alert(err.message || 'Error al iniciar el pago');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        className="cart-drawer-backdrop"
        onClick={toggleCart}
      />

      <div className={`cart-drawer ${cartOpen ? 'open' : ''}`}>
        <div className="flex flex-col h-full">
          <div className="cart-header">
            <h2 className="cart-title">Mi carrito ({totalItems})</h2>
            <button className="cart-close-btn" onClick={toggleCart}>×</button>
          </div>

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

          {cart.length > 0 && (
            <div className="cart-footer">
              <div className="cart-total">
                <span>Total:</span>
                <span className="cart-total-price">${totalPrice.toLocaleString('es-AR')}</span>
              </div>
              <button
                onClick={handleCheckout}
                disabled={loading}
                className={`btn-checkout ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {loading ? 'Procesando...' : 'Finalizar compra'}
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