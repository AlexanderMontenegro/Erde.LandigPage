import { useState } from "react";

export default function ProductCard({ product }) {
  const [variantIndex, setVariantIndex] = useState(0);
  const variant = product.variants[variantIndex];

  const outOfStock = variant.stock === 0;

  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} />

      <h3>{product.name}</h3>
      <p>{product.description}</p>

      <select onChange={(e) => setVariantIndex(e.target.value)}>
        {product.variants.map((v, i) => (
          <option key={i} value={i}>
            {v.material} | {v.color} | {v.size} | {v.quality}
          </option>
        ))}
      </select>

      <p className="price">${variant.price.toLocaleString()}</p>
      <p className={outOfStock ? "no-stock" : "stock"}>
        {outOfStock ? "Sin stock" : `Stock: ${variant.stock}`}
      </p>

      <button disabled={outOfStock}>
        {outOfStock ? "No disponible" : "Agregar al carrito"}
      </button>
    </div>
  );
}
