export default function ProductCard(props) {
  const product = props.product;

  // 🛑 Protección ABSOLUTA
  if (!product || typeof product !== "object") {
    console.warn("ProductCard recibió product inválido:", product);
    return null;
  }

  const {
    name = "Producto sin nombre",
    description = "",
    image = "",
    basePrice = 0,
    stock = 0,
  } = product;

  return (
    <div className="product-card">
      <h3>{name}</h3>
      <p>{description}</p>
      <p>$ {basePrice}</p>
      <p>Stock: {stock}</p>
    </div>
  );
}
