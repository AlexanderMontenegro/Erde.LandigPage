import { useState } from "react";
import { useCartStore } from "../store/cartStore";

export default function CartFloating() {
  const [open, setOpen] = useState(false);

  const items = useCartStore((s) => s.items);
  const removeFromCart = useCartStore((s) => s.removeFromCart);
  const totalItems = useCartStore((s) => s.totalItems());
  const totalPrice = useCartStore((s) => s.totalPrice());

  if (totalItems === 0) return null;

  return (
    <>
      {/* 🛒 BOTÓN FLOTANTE */}
      <button
        onClick={() => setOpen(true)}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          background: "#7c3aed",
          color: "#fff",
          fontSize: "26px",
          border: "none",
          cursor: "pointer",
          zIndex: 40,
        }}
      >
        🛒
        <span
          style={{
            position: "absolute",
            top: "-6px",
            right: "-6px",
            background: "#22c55e",
            color: "#000",
            width: "22px",
            height: "22px",
            borderRadius: "50%",
            fontSize: "13px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
          }}
        >
          {totalItems}
        </span>
      </button>

      {/* 📦 PANEL */}
      {open && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            zIndex: 50,
          }}
          onClick={() => setOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "absolute",
              right: 0,
              top: 0,
              height: "100%",
              width: "360px",
              background: "#020617",
              color: "#fff",
              padding: "20px",
              overflowY: "auto",
            }}
          >
            <h2>🛒 Tu carrito</h2>

            {items.map((item, index) => (
              <div
                key={index}
                style={{
                  borderBottom: "1px solid #334155",
                  paddingBottom: "10px",
                  marginBottom: "10px",
                }}
              >
                <strong>{item.name}</strong>
                <p>${item.price}</p>

                {item.variants && (
                  <small style={{ color: "#cbd5f5" }}>
                    {Object.entries(item.variants).map(
                      ([k, v]) => `${k}: ${v} `
                    )}
                  </small>
                )}

                <p>Cantidad: {item.quantity}</p>

                <button
                  onClick={() => removeFromCart(index)}
                  style={{
                    marginTop: "6px",
                    background: "#ef4444",
                    color: "#fff",
                    border: "none",
                    padding: "6px 10px",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  Quitar
                </button>
              </div>
            ))}

            <h3>Total: ${totalPrice}</h3>

            <button
              style={{
                width: "100%",
                marginTop: "10px",
                padding: "14px",
                borderRadius: "10px",
                background: "#22c55e",
                color: "#000",
                border: "none",
                fontSize: "16px",
                cursor: "pointer",
              }}
              onClick={() =>
                alert("Próximo paso: WhatsApp / Checkout 🚀")
              }
            >
              Finalizar compra
            </button>
          </div>
        </div>
      )}
    </>
  );
}
