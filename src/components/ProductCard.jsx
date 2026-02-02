export default function ProductCard({ product }) {
  if (!product) return null;

  const {
    name,
    description,
    basePrice,
    stock = 0,
    image,
    variants = {},
  } = product;

  const isOutOfStock = stock <= 0;

  return (
    <div
      style={{
        border: "1px solid #333",
        padding: "16px",
        borderRadius: "10px",
        background: "#111",
        color: "#fff",
        opacity: isOutOfStock ? 0.6 : 1,
      }}
    >
      {/* 🖼️ IMAGEN */}
      {image ? (
        <img
          src={image}
          alt={name}
          style={{
            width: "100%",
            height: "200px",
            objectFit: "cover",
            borderRadius: "8px",
            marginBottom: "12px",
          }}
        />
      ) : (
        <div
          style={{
            width: "100%",
            height: "200px",
            background: "#222",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "8px",
            marginBottom: "12px",
            color: "#777",
          }}
        >
          Sin imagen
        </div>
      )}

      <h3>{name}</h3>
      <p>{description}</p>

      <p>
        <strong>Precio base:</strong> ${basePrice}
      </p>

      <p>
        <strong>Stock:</strong> {stock}
      </p>

      {variants.material && (
        <p>
          <strong>Material:</strong> {variants.material.join(", ")}
        </p>
      )}

      {variants.color && (
        <p>
          <strong>Color:</strong> {variants.color.join(", ")}
        </p>
      )}

      <button
        disabled={isOutOfStock}
        style={{
          marginTop: "10px",
          width: "100%",
          padding: "10px",
          background: isOutOfStock ? "#444" : "#7c3aed",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          cursor: isOutOfStock ? "not-allowed" : "pointer",
        }}
      >
        {isOutOfStock ? "Sin stock" : "Comprar"}
      </button>
    </div>
  );
}
