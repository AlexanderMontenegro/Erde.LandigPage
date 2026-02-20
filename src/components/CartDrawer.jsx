import { useEffect, useState } from "react";
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";
import useProductStore from "../store/productStore.js";
import useAuthStore from "../store/authStore.js";

// 🔹 Inicializar una sola vez
initMercadoPago(import.meta.env.VITE_MERCADO_PAGO_PUBLIC_KEY);

export default function CartDrawer() {
  const {
    cart,
    cartOpen,
    toggleCart,
    removeFromCart,
    updateQty,
    getTotalItems,
    getTotalPrice,
  } = useProductStore();

  const { user, toggleAuthModal } = useAuthStore();

  const [preferenceId, setPreferenceId] = useState(null);
  const [loading, setLoading] = useState(false);

  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();

  useEffect(() => {
    if (!user || cart.length === 0) {
      setPreferenceId(null);
      return;
    }

    const createPreference = async () => {
      try {
        setLoading(true);

        const items = cart.map((item) => ({
          title: item.name,
          unit_price: Number(item.basePrice),
          quantity: Number(item.qty),
        }));

        const res = await fetch(
          "https://erde-landigpage-server.onrender.com/create_preference",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ items }),
          }
        );

        if (!res.ok) {
          throw new Error("Error en servidor");
        }

        const data = await res.json();
        setPreferenceId(data.id);
      } catch (error) {
        console.error("Error creando preferencia:", error);
      } finally {
        setLoading(false);
      }
    };

    createPreference();
  }, [cart, user]);

  if (!cartOpen) return null;

  return (
    <>
      <div className="cart-drawer-backdrop" onClick={toggleCart} />

      <div className={`cart-drawer ${cartOpen ? "open" : ""}`}>
        <div className="flex flex-col h-full">
          <div className="cart-header">
            <h2 className="cart-title">Mi carrito ({totalItems})</h2>
            <button className="cart-close-btn" onClick={toggleCart}>
              ×
            </button>
          </div>

          <div className="flex-1 p-6 overflow-y-auto space-y-6">
            {cart.length === 0 ? (
              <div className="text-center py-20 text-text-muted">
                <p className="text-xl">Tu carrito está vacío</p>
                <p className="mt-2">¡Agrega productos para continuar!</p>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="cart-item">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="cart-item-img"
                    onError={(e) =>
                      (e.target.src =
                        "https://via.placeholder.com/96?text=Sin+img")
                    }
                  />
                  <div className="cart-item-info">
                    <h3 className="cart-item-name">{item.name}</h3>
                    <p className="cart-item-price">
                      ${item.basePrice.toLocaleString("es-AR")} × {item.qty}
                    </p>

                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center bg-bg rounded-lg border border-border overflow-hidden">
                        <button
                          onClick={() => updateQty(item.id, -1)}
                          className="w-10 h-10 flex items-center justify-center text-xl hover:bg-card-hover transition"
                        >
                          −
                        </button>
                        <span className="w-12 text-center font-medium text-lg">
                          {item.qty}
                        </span>
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
                <span className="cart-total-price">
                  ${totalPrice.toLocaleString("es-AR")}
                </span>
              </div>

              {!user ? (
                <button onClick={toggleAuthModal} className="btn-checkout">
                  Iniciar sesión para pagar
                </button>
              ) : loading ? (
                <button className="btn-checkout" disabled>
                  Preparando pago...
                </button>
              ) : preferenceId ? (
                <div className="mp-wallet-container">
                  <Wallet initialization={{ preferenceId }} />
                </div>
              ) : null}

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