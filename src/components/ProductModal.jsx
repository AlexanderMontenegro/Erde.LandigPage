import { useState } from "react";
import { useCartStore } from "../store/cartStore";

export default function ProductModal({ product, onClose }) {
  if (!product) return null;

  const addToCart = useCartStore((state) => state.addToCart);

  const {
    name,
    description,
    basePrice,
    stock = 0,
    image,
    variants = {},
    customizable,
    fabricationTimeDays,
  } = product;

  const [selected, setSelected] = useState({});

  const handleSelect = (type, value) => {
    setSelected((prev) => ({ ...prev, [type]: value }));
  };

  const allVariantsSelected = Object.keys(variants).every(
    (key) => selected[key]
  );

  const canBuy = stock > 0 && allVariantsSelected;

  const handleAdd = () => {
    addToCart(product, selected);
    onClose();
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.7)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 50,
      }}
    >
      {/* ❌ Cerrar */}
      <button
        onClick={onClose}
        style={{
          position: "fixed",
          top: "20px",
          right: "20px",
          width: "44px",
          height: "44px",
          borderRadius: "50%",
          background: "#020617",
          border: "2px solid #7c3aed",
          color: "#fff",
          fontSize: "22px",
          cursor: "pointer",
          zIndex: 60,
        }}
      >
        ✕
      </button>

      <div
        style={{
          background: "#020617",
          color: "#fff",
          width: "90%",
          maxWidth: "520px",
          maxHeight: "85vh",
          overflowY: "auto",
          borderRadius: "14px",
          padding: "20px",
        }}
      >
        {image && (
          <img
            src={image}
            alt={name}
            style={{
              width: "100%",
              height: "220px",
              objectFit: "cover",
              borderRadius: "10px",
            }}
          />
        )}

        <h2>{name}</h2>
        <p style={{ color: "#cbd5f5" }}>{description}</p>

        <p style={{ fontWeight: "bold" }}>${basePrice}</p>

        {Object.entries(variants).map(([type, options]) => (
          <div key={type} style={{ marginTop: "12px" }}>
            <strong>{type.toUpperCase()}</strong>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => handleSelect(type, opt)}
                  style={{
                    padding: "8px 12px",
                    borderRadius: "6px",
                    background:
                      selected[type] === opt ? "#7c3aed" : "#020617",
                    border: "1px solid #475569",
                    color: "#fff",
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        ))}

        <button
          disabled={!canBuy}
          onClick={handleAdd}
          style={{
            marginTop: "18px",
            width: "100%",
            padding: "14px",
            borderRadius: "10px",
            background: canBuy ? "#22c55e" : "#334155",
            color: "#fff",
            border: "none",
            fontSize: "16px",
            cursor: canBuy ? "pointer" : "not-allowed",
          }}
        >
          {canBuy ? "Agregar al carrito" : "Seleccioná variantes"}
        </button>
      </div>
    </div>
  );
}
