export default function ProductCard({ product }) {
  if (!product) return null;

  const {
    name,
    description,
    basePrice,
    stock = 0,
    variants = {},
  } = product;

  const isOutOfStock = stock <= 0;

  return (
    <div style={{
      border: "1px solid #ccc",
      padding: "16px",
      borderRadius: "8px",
      opacity: isOutOfStock ? 0.6 : 1
    }}>
      <h3>{name}</h3>
      <p>{description}</p>

      <p><strong>Precio base:</strong> ${basePrice}</p>
      <p><strong>Stock:</strong> {stock}</p>

      {variants.material && (
        <p><strong>Materiales:</strong> {variants.material.join(", ")}</p>
      )}

      {variants.color && (
        <p><strong>Colores:</strong> {variants.color.join(", ")}</p>
      )}

      <button disabled={isOutOfStock}>
        {isOutOfStock ? "Sin stock" : "Comprar"}
      </button>
    </div>
  );
}
