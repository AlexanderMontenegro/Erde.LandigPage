export default function ProductCard({ product, onSelect }) {
  if (!product) return null;

  const { name, basePrice, image, stock = 0 } = product;

  return (
    <div
      onClick={() => onSelect(product)}
      style={{
        background: "#020617",
        border: "1px solid #334155",
        borderRadius: "12px",
        padding: "12px",
        cursor: "pointer",
        transition: "transform 0.2s",
      }}
    >
      {/* Imagen */}
      {image && (
        <img
          src={image}
          alt={name}
          style={{
            width: "100%",
            height: "180px",
            objectFit: "cover",
            borderRadius: "8px",
          }}
        />
      )}

      <h3 style={{ marginTop: "8px" }}>{name}</h3>

      <p style={{ fontWeight: "bold", color: "#22c55e" }}>
        ${basePrice}
      </p>

      <p style={{ fontSize: "12px", color: "#94a3b8" }}>
        {stock > 0 ? `Stock: ${stock}` : "Sin stock"}
      </p>
    </div>
  );
}
